export class Yazdir {
    /** 2026-01-26T19:03:14.165Z -> 26 Ocak 2026 16:03 */
    public static TarihSaat(Yazi_UTC?: string, Saat: boolean = false): string | undefined {
        if (!Yazi_UTC || Yazi_UTC.length != 24) return Yazi_UTC;
        const tarih = new Date(Yazi_UTC);

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

    /**2026-01-26T19:03:14.165Z -> 2026-01-26-19-03-14-165*/
    public static TarihSaat_Dsy(Yazi_UTC: string): string {
        return Yazi_UTC.replace('T', '-').replaceAll(':', '-').replace('.', '-').replace("Z", "");
    }

    /** 1.250,00 ₺ */
    public static Ucret(Sayi: number, pbe: boolean = false): string {
        if (isNaN(Sayi)) throw new Error("yzdrm");

        const formatli = new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Sayi); //

        return formatli + (pbe ? " ₺" : "");
    }

	/** 1.25 MB */
    public static Dosya_Boyutu(Boyutu: number, NoktadanSonrakiHaneSayisi: number = 2): string {
        if (Boyutu === 0) return '0 Bytes';

        const k = 1024;
        const dm = NoktadanSonrakiHaneSayisi < 0 ? 0 : NoktadanSonrakiHaneSayisi;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        const i = Math.floor(Math.log(Boyutu) / Math.log(k));

        return parseFloat((Boyutu / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}