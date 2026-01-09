import { BaytDizisi } from "./BaytDizisi";

export class Yazi {
    private static _TextEncoder = new TextEncoder();
    public static BaytDizisine(Girdi: string): Uint8Array {
        return Yazi._TextEncoder.encode(Girdi);
    }

    public static Rastgele(U: number = 8): string {
        const karakterler = "abcdefghijklmnopqrstuvwxyz0123456789";
        let isim = "";
        for (let i = 0; i < U; i++) {
            isim += karakterler.charAt(Math.floor(Math.random() * karakterler.length));
        }
        return isim;
    }

    public static HexYaziya(Girdi: string): string {
        return "0x" + BaytDizisi.HexYaziya(Yazi.BaytDizisine(Girdi));
    }

    // public static Nesne_Birlestir<T>(A: T, B: T): T {
    //     const birlesik = { ...A, ...B };
    //     return birlesik;
    // } 
    // public static Nesneye2<T extends object>(SinifTipi: new () => T, Yazi: string): T {
    //     const Nesne: any = JSON.parse(Yazi);
    //     const instance = new SinifTipi();
    //     return Object.assign(instance, Nesne);
    // }
    public static Nesneye<T>(Yazi: string): T | null {
        return JSON.parse(Yazi) as T;
    }
    public static Nesneden(nesne: any): string {
        return JSON.stringify(nesne);
    }

    public static Simdi_UTC(Ekle_msn: number = 0): string {
        const trh = Date.now() + Ekle_msn;
        return new Date(trh).toISOString().slice(0, -1); //Z iptal
    }
}