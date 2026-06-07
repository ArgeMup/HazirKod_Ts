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

    public static BenzerMi(girdi: string, kıstas: string, büyükKüçükHarfDuyarlı: boolean = true, ayraç: string = '*'): boolean {
        // 1. Erken çıkış: boş kontrol
        if (!girdi || !kıstas) return false;

        // 2. Erken çıkış: kıstas sadece tek ayraçsa her şeyle eşleşir
        if (kıstas.length === 1 && kıstas[0] === ayraç) return true;

        const karşılaştır = (a: string, b: string): boolean =>
            büyükKüçükHarfDuyarlı ? a === b : a.toLocaleLowerCase() === b.toLocaleLowerCase();

        const içeriyorMu = (kaynak: string, aranan: string, baştan: number): number => {
            if (!büyükKüçükHarfDuyarlı) {
                return kaynak.toLocaleLowerCase().indexOf(aranan.toLocaleLowerCase(), baştan);
            }
            return kaynak.indexOf(aranan, baştan);
        };

        const ileBaslıyorMu = (kaynak: string, önek: string): boolean => {
            const parça = kaynak.slice(0, önek.length);
            return karşılaştır(parça, önek);
        };

        const ileBitiyorMu = (kaynak: string, sonek: string): boolean => {
            const parça = kaynak.slice(kaynak.length - sonek.length);
            return karşılaştır(parça, sonek);
        };

        // 3. Erken çıkış: hiç wildcard yoksa direkt karşılaştır
        if (!kıstas.includes(ayraç)) return karşılaştır(girdi, kıstas);

        const başAyraç = kıstas[0] === ayraç;
        const sonAyraç = kıstas[kıstas.length - 1] === ayraç;

        // 4. Prefix kontrolü
        if (!başAyraç) {
            const sonu = kıstas.indexOf(ayraç);
            const ilkSeg = sonu < 0 ? kıstas : kıstas.slice(0, sonu);
            if (!ileBaslıyorMu(girdi, ilkSeg)) return false;
        }

        // 5. Suffix kontrolü
        if (!sonAyraç) {
            const başı = kıstas.lastIndexOf(ayraç);
            const sonSeg = başı < 0 ? kıstas : kıstas.slice(başı + 1);
            if (!ileBitiyorMu(girdi, sonSeg)) return false;
        }

        // 6. Tüm segmentleri sırayla tara
        let gi = 0; // girdi pozisyonu
        let ki = 0; // kıstas okuma pozisyonu

        while (ki < kıstas.length) {
            if (kıstas[ki] === ayraç) { ki++; continue; } // ayracı atla

            const segBaş = ki;
            while (ki < kıstas.length && kıstas[ki] !== ayraç) ki++;
            const seg = kıstas.slice(segBaş, ki);

            const idx = içeriyorMu(girdi, seg, gi);
            if (idx < 0) return false;
            gi = idx + seg.length;
        }

        return true;
    }
}