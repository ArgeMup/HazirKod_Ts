import { Yazi } from "./Yazi";

export class Json {
    public static Sozlukten_Listeye(json: Record<string, any>): any[] {
        if (!json) return [];

        const values: any[] = Object.values(json);
        const ilk: any = values[0];
        const varmi: boolean = ilk && typeof ilk === "object" && "Ad" in ilk;

        return Object.entries(json).map(([key, value]: [string, any]) => {
            if (varmi) {
                return {
                    __Golgesi__: key,
                    ...value
                };
            } else {
                return {
                    __Golgesi__: Yazi.HexYaziya(key),
                    Ad: key,
                    ...value
                };
            }
        });
    }

    public static Listeden_Sozluge(liste: any[]): Record<string, any> {
        if (!liste || !Array.isArray(liste)) return {};

        const sonuc: Record<string, any> = {};

        liste.forEach((item: any) => {
            if (!item || typeof item !== "object") return;

            let key: string | null = null;
            let kalanlar: any = {};

            // Önce __Golgesi__ var mı kontrol et
            if ("__Golgesi__" in item) {
                const { __Golgesi__, ...rest } = item;
                key = __Golgesi__;
                kalanlar = rest;
            }
            // __Golgesi__ yoksa Ad'a bak
            else if ("Ad" in item) {
                const { Ad, ...rest } = item;
                key = Ad;
                kalanlar = rest;
            }

            // Key bulunamadıysa bu öğeyi atla
            if (!key) return;
            sonuc[key] = kalanlar;
        });

        return sonuc;
    }
    
    public static BagimsizKopya<T>(json: T): T {
        return JSON.parse(JSON.stringify(json));
    }
}