export class Yazdir {
    public static TarihSaat(Yazi_UTC: string, Saat: boolean = false): string {
        if (!Yazi_UTC || Yazi_UTC.length != 23) return Yazi_UTC;
        Yazi_UTC += "Z";                                //2025-05-05T18:42:14.165Z  
        const tarih = new Date(Yazi_UTC);               //2025-05-05T21:42:14.165

        // Tarih geçersizse orijinali döndür
        if (isNaN(tarih.getTime())) throw new Error("geçersiz " + Yazi_UTC);

        const ayarlari: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        if (Saat) {
            ayarlari.hour = "2-digit";
            ayarlari.minute = "2-digit";
            ayarlari.hour12 = false;
        }

        const locale = typeof navigator !== "undefined" ? (navigator.language || "tr-TR") : "tr-TR";
        return tarih.toLocaleString(locale, ayarlari);
    }

    public static TarihSaat_Dsy(Yazi_UTC: string): string {
        return Yazi_UTC.replace('T', '-').replaceAll(':', '-').replace('.', '-').replace("Z", "");
    }

    public static Ucret(Sayi: number, pbe: boolean = false): string {
        if (isNaN(Sayi)) throw new Error("yzdrm");

        const formatli = new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Sayi); //1.250,00

        return formatli + (pbe ? " ₺" : "");
    }
}