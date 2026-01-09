export class BaytDizisi {
    private static _TextDecoder = new TextDecoder();
    public static Yaziya(BaytDizisi: Uint8Array): string {
        return this._TextDecoder.decode(BaytDizisi);
    }

    public static HexYaziya(BaytDizisi: Uint8Array): string {
        return Array.from(BaytDizisi)
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    public static Base64_e(Dizi: Uint8Array): string {
        const binaryString = String.fromCharCode(...Dizi);
        return btoa(binaryString);
    }

    public static Base64_ten(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray;
    }

    public static async SHA256(BaytDizisi: Uint8Array): Promise<Uint8Array> {
        const hashBuffer = await crypto.subtle.digest('SHA-256', BaytDizisi.buffer as ArrayBuffer);
        return new Uint8Array(hashBuffer);
    }
}