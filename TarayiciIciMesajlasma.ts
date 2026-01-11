type TarayiciIciMesajlasma_GeriBildirimIslemi_ = (Mesaj: any) => void;

export class TarayiciIciMesajlasma_ {
    private Kanal: BroadcastChannel | null = null;
    private Islemler: TarayiciIciMesajlasma_GeriBildirimIslemi_[] = [];

    public constructor(Kanal: string) {
        this.Kanal = new BroadcastChannel(Kanal);
        this.Kanal.addEventListener('message', (e) => {
            this.Islemler.forEach(islem => {
                try {
                    islem(e.data);
                } catch (hata) {
                    console.error("Dinleyici hatası:", hata);
                }
            });
        });
    }

    public DinleyiciEkle(Islem: TarayiciIciMesajlasma_GeriBildirimIslemi_): void {
        if (!this.Islemler.includes(Islem)) {
            this.Islemler.push(Islem);
        }
    }

    public Gonder(Mesaj: any): void {
        this.Kanal!.postMessage(Mesaj);
    }
}

export const TarayiciIciMesajlasma = new TarayiciIciMesajlasma_('ArGeMuP_HazirKod_Ts_TarayiciIciMesajlasma');