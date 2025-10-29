import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DATA_SOURCES = [
  "https://www.data.gouv.fr/fr/datasets/r/01aa7df5-1bfc-4ba8-ade1-52e52d8dddf2",
  "https://www.data.gouv.fr/fr/datasets/r/f97ea53c-87c7-4458-957a-7c7de63e0db3",
  "https://www.data.gouv.fr/fr/datasets/r/cc4c1917-73ca-4db7-a7dd-8cdb0c1c7938",
];

interface DefibrillatorData {
  fields?: {
    nom?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    lat?: number;
    long?: number;
    latitude?: number;
    longitude?: number;
    geo_point_2d?: [number, number];
    acces?: string;
    disponibilite?: string;
    tel?: string;
  };
  recordid?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let totalProcessed = 0;
    let totalInserted = 0;
    let totalUpdated = 0;
    const errors: string[] = [];

    for (const sourceUrl of DATA_SOURCES) {
      try {
        console.log(`Fetching from ${sourceUrl}`);
        const response = await fetch(sourceUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const records = data.records || [];

        console.log(`Processing ${records.length} records from ${sourceUrl}`);

        for (const record of records as DefibrillatorData[]) {
          try {
            const fields = record.fields || {};
            
            let latitude = fields.lat || fields.latitude;
            let longitude = fields.long || fields.longitude;

            if (!latitude && !longitude && fields.geo_point_2d) {
              latitude = fields.geo_point_2d[0];
              longitude = fields.geo_point_2d[1];
            }

            if (!latitude || !longitude) {
              continue;
            }

            const defibrillatorData = {
              external_id: record.recordid || `${latitude}-${longitude}`,
              nom: fields.nom || "Défibrillateur",
              adresse: fields.adresse || "",
              ville: fields.ville || "",
              code_postal: fields.code_postal || "",
              latitude: parseFloat(latitude.toString()),
              longitude: parseFloat(longitude.toString()),
              acces: fields.acces || "",
              disponibilite: fields.disponibilite || "",
              tel: fields.tel || "",
              source_dataset: sourceUrl,
              updated_at: new Date().toISOString(),
            };

            const { data: existing } = await supabase
              .from("defibrillators")
              .select("id")
              .eq("external_id", defibrillatorData.external_id)
              .maybeSingle();

            if (existing) {
              await supabase
                .from("defibrillators")
                .update(defibrillatorData)
                .eq("id", existing.id);
              totalUpdated++;
            } else {
              await supabase
                .from("defibrillators")
                .insert(defibrillatorData);
              totalInserted++;
            }

            totalProcessed++;
          } catch (recordError) {
            console.error("Error processing record:", recordError);
            errors.push(`Record error: ${recordError.message}`);
          }
        }
      } catch (sourceError) {
        console.error(`Error fetching from ${sourceUrl}:`, sourceError);
        errors.push(`Source ${sourceUrl}: ${sourceError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalProcessed,
        totalInserted,
        totalUpdated,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});