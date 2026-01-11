import { Kendi } from "../Ortak/Kendi";

export class D_TarihSaat_UTC {
    /**2026-12-31T03:59:59.999Z*/
    public static Simdi(): string {
        return new Date().toISOString();
    }
    /**UTC -> 2026-12-31T03:59:59.999Z*/
    public static Yaziya(Girdi: Date): string {
        return Girdi.toISOString();
    }
    /**2026-12-31T03:59:59.999Z -> UTC*/
    public static Yazidan(Girdi: string): Date {
        const dt = new Date(Girdi);

        // if (isNaN(dt.getTime()) || !Girdi.endsWith('Z')) {
        //     throw new Error("Hatalı UTC formatı!");
        // }

        return dt;
    }

    /**2026-12-31T03:59:59.999Z -> 2026-12-31T06:59*/
    public static UTC_Yazidan_Yerel_Yaziya(ISO_olarak: string): string {
        const utc_yrl = new Date(ISO_olarak);
        const yrl = new Date(utc_yrl.getTime() - utc_yrl.getTimezoneOffset() * 60000);
        return yrl.toISOString().slice(0, 16);
    }
    /**2026-12-31T06:59 -> 2026-12-31T03:59:00.000Z*/
    public static Yerel_Yazidan_UTC_Yaziya(Yerel: string): string {
        const trh = new Date(Yerel);
        return trh.toISOString();
    };
}

interface I_D_Sayi {
    Aralik_Dusuk?: number, Aralik_Yuksek?: number,
    TamSayiOlmali?: boolean,
    IciBosOlabilir?: boolean,
    HataDurumunda_UyariGoster?: boolean
}
export class D_Sayi {
    public static Yazidan(Girdi: string | undefined | null, Secenekler: I_D_Sayi = {}): [TumKistaslaraUygun: boolean, Cikti?: number, DuzeltilmisGirdi?: string] {
        const {
            Aralik_Dusuk = -Infinity, Aralik_Yuksek = Infinity,
            TamSayiOlmali = false,
            IciBosOlabilir = false,
            HataDurumunda_UyariGoster = true
        } = Secenekler;

        Girdi = Girdi?.trim();
        if (!Girdi) {
            if (IciBosOlabilir) return [true, undefined, ''];

            if (HataDurumunda_UyariGoster) Kendi.Uyari('Girdi (' + Girdi + ') içi boş', 'Girilen yazı sayıya dönüştürülemedi');
            return [false];
        }

        const virgul_var = Girdi.includes(',');
        if (virgul_var) {
            if (Girdi.includes('.')) {
                if (HataDurumunda_UyariGoster) Kendi.Uyari('Girdi (' + Girdi + ') içinde hem virgül hem nokta var', 'Girilen yazı sayıya dönüştürülemedi');
                return [false];
            }

            Girdi = Girdi.replace(',', '.');
        }

        const NoktaSayisi = (Girdi.match(/\./g) || []).length;
        if (NoktaSayisi > 1) {
            if (HataDurumunda_UyariGoster) Kendi.Uyari('Girdi (' + Girdi + ') içinde birden fazla nokta var', 'Girilen yazı sayıya dönüştürülemedi');
            return [false];
        }

        const sayi = Number(Girdi);

        if (isNaN(sayi) ||
            !isFinite(sayi) ||
            sayi < Aralik_Dusuk ||
            sayi > Aralik_Yuksek) {
            if (HataDurumunda_UyariGoster) Kendi.Uyari('Girdi (' + Girdi + ') aralığın dışında\n En yüksek : ' + Aralik_Yuksek + '\nEn düşük : ' + Aralik_Dusuk, 'Girilen yazı sayıya dönüştürülemedi');
            return [false];
        }

        if (TamSayiOlmali && !Number.isInteger(sayi)) {
            if (HataDurumunda_UyariGoster) Kendi.Uyari('Girdi (' + Girdi + ') tamsayı olmalı', 'Girilen yazı sayıya dönüştürülemedi');
            return [false];
        }

        return [true, sayi, Girdi];
    }

    public static Yaziya(
        Girdi: number | undefined,
        Ondalik_Karakter_Sayisi: number,
        Tamsayida_Ayrac_olsun = false,
        OndaliktakiSifirlariSil = true)
        : string {
        if (!Girdi) return '';

        return new Intl.NumberFormat(undefined, {
            minimumFractionDigits: OndaliktakiSifirlariSil ? 0 : Ondalik_Karakter_Sayisi,
            maximumFractionDigits: Ondalik_Karakter_Sayisi,
            useGrouping: Tamsayida_Ayrac_olsun, // Binlik ayraç kontrolü
        }).format(Girdi);
    }

    public static UygunMu(Girdi: any, Aralik_Dusuk?:number, Aralik_Yuksek?:number, TamSayiOlmali?: boolean): boolean {
        const sayi = Number(Girdi);

        if (isNaN(sayi) ||
            !isFinite(sayi) ||
            sayi < (Aralik_Dusuk ?? -Infinity) ||
            sayi > (Aralik_Yuksek ?? Infinity)) {
            return false;
        }

        if (TamSayiOlmali === true && !Number.isInteger(sayi)) {
            return false;
        }

        return true;
    }
}