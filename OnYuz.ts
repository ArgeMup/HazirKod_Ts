import { D_TarihSaat_UTC } from './Donusturme'

// interface OnYuz_Sozluk {
//     [Ad: string]: { Icerik: string, Golge:string }
// }
// interface OnYuz_Liste_Biri_ {
//     Ad: string;
//     Icerik: string;
//     Golge: string;
// }//const liste: OnYuz_Liste[] = [];

export class OnYuz {
    public static Json_dan(json: any): void {
        if (!json || typeof json !== "object") return;

        for (const anahtar in json) {
            if (!Object.prototype.hasOwnProperty.call(json, anahtar)) continue;

            const deger: string = json[anahtar];

            if (Array.isArray(deger)) {
                if (deger.length > 0 && typeof deger[0] === "object") {
                    deger.forEach((altJson: any) => {
                        this.Json_dan(altJson);
                    });
                }
                continue;
            }

            if (typeof deger === "object" && deger !== null) {
                this.Json_dan(deger);
                continue;
            }

            const eleman = document.getElementById(anahtar);
            if (!eleman) continue;

            const formElemani = eleman as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

            switch (formElemani.type) {
                case "text":
                case "number":
                case "textarea":
                case "select-one":
                    formElemani.value = String(deger ?? "");
                    break;

                case "datetime-local":
                    formElemani.value = deger ? D_TarihSaat_UTC.UTC_Yazidan_Yerel_Yaziya(deger) : '';
                    break;

                case "checkbox":
                    (formElemani as HTMLInputElement).checked = Boolean(deger);
                    break;

                // case "button":
                //     eleman.innerText = String(deger ?? "");
                //     break;

                default:
                    throw new Error("Desteklenmeyen tip (okuma): " + (formElemani.type || eleman.tagName));
            }
        }
    }

    public static Json_a(json: any): any {
        if (!json || typeof json !== "object") return json;

        for (const anahtar in json) {
            if (!Object.prototype.hasOwnProperty.call(json, anahtar)) continue;

            const deger: string = json[anahtar];

            if (Array.isArray(deger)) {
                if (deger.length > 0 && typeof deger[0] === "object") {
                    deger.forEach((altJson: any) => {
                        this.Json_a(altJson);
                    });
                }
                continue;
            }

            if (typeof deger === "object" && deger !== null) {
                this.Json_a(deger);
                continue;
            }

            const eleman = document.getElementById(anahtar);
            if (!eleman) continue;

            const formElemani = eleman as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

            switch (formElemani.type) {
                case "text":
                case "textarea":
                case "select-one":
                    json[anahtar] = formElemani.value;
                    break;

                case "number":
                    const sayiDegeri = parseFloat(formElemani.value);
                    json[anahtar] = isNaN(sayiDegeri) ? null : sayiDegeri;
                    break;

                case "datetime-local":
                    json[anahtar] = formElemani.value ? D_TarihSaat_UTC.Yerel_Yazidan_UTC_Yaziya(formElemani.value) : null;
                    break;

                case "checkbox":
                    json[anahtar] = (formElemani as HTMLInputElement).checked;
                    break;

                // case "button":
                //     json[anahtar] = eleman.innerText;
                //     break;

                default:
                    throw new Error("Desteklenmeyen tip (yazma): " + (formElemani.type || eleman.tagName));
            }
        }

        return json;
    }

    public static Listeden_SecimKutusuna(json: any[], SecimKutusu: HTMLSelectElement | null, SeciliOlaninGolgesi?: string): void {
        if (!json || SecimKutusu == null) return;

        SecimKutusu.innerHTML = '';
        json.forEach((biri: any) => {
            SecimKutusu.add(new Option(String(biri.Ad), String(biri.__Golgesi__),
                false,
                biri.__Golgesi__ === SeciliOlaninGolgesi
            )
            );
        });
    }

    public static Temizle(): void {
        const klsyn = Array.from(document.getElementsByClassName("degisti"));
        klsyn.forEach(el => {
            (el as HTMLElement).classList.remove('degisti');
        });
    }

    public static IcinYazi(Girdi: unknown): string {
        if (Girdi === null || Girdi === undefined) return '';
        return String(Girdi).replace(/[\\%&<:='";]/g, '?');
    }

    /**
        function Ara(Sorgu: string) {
            console.log("Aranıyor :", Sorgu);
        }

        const ErtelenmisArama = ErteleyerekCalistir(Ara, 500);
        ErtelenmisArama("a"); // 500 ms sonra "Aranıyor : a" yazdırır.
        ErtelenmisArama("ab"); // Önceki çağrıyı iptal eder ve 500 ms sonra "Aranıyor : ab" yazdır
    */
    public static ErteleyerekCalistir<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;

        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }
}

/**
* | HTML Etiketi | Değişken | Tipi |
* | :--- | :--- | :--- |
* | HTMLInputElement
* | `<input type="text">` | `.value` | `string` |
* | `<input type="checkbox">` | `.checked` | `boolean` |
* | `<input type="radio">` | `.checked` | `boolean` |
* | `<input type="number">` | `.valueAsNumber` | `number` |
* | `<input type="date">` | `.valueAsDate` | `Date \| null` |
* | `<input type="datetime-local">` | `.valueAsDate` | `Date \| null` |
* | `<input type="color">` | `.value` | `string (hex kod)` |
* | `<input type="file">` | `.files` | `FileList \| null` |
* | `<input type="range">` | `.value` | `string (sayı)` |
* | HTMLTextAreaElement
* | `<textarea>` | `.value` | `string` |
* | HTMLSelectElement
* | `<select>` | `.value` | `string` |
* | HTMLOptionElement
* | `<option>` | `.value` veya `.text` | `string` |
* | HTMLButtonElement
* | `<button>` | `.textContent` | `string` |
* | HTMLFormElement
* | `<form>` | `.elements` | `HTMLFormControlsCollection` |
* | HTMLDivElement
* | `<div>` | `.textContent` | `string` |
* | HTMLIFrameElement
* | `<iframe>` | `.contentWindow` | `Window \| null` |
* | HTMLImageElement
* | `<img>` | `.src` | `string` |
* | HTMLSpanElement
* | `<span>` | `.textContent` | `string` |
* | HTMLParagraphElement
* | `<p>` | `.textContent` | `string` |
* | HTMLAnchorElement
* | `<a>` | `.href` | `string` |
* | HTMLHeadingElement
* | `<H1-6>` | `.textContent` | `string` |
* | HTMLTableElement
* | `<table>` | `.rows` | `HTMLCollectionOf<HTMLTableRowElement>` |
* | - - - - -
* | Eleman.???('???').addEventListener(
        'change', 
        async (e: Event) => {
            const bu = e.target as HTML???Element;
        });
* | - - - - -    
*/
export class Eleman {
    public static Giris(id: string): HTMLInputElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLInputElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Buton(id: string): HTMLButtonElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLButtonElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static MetinKutusu(id: string): HTMLTextAreaElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLTextAreaElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static SecimKutusu(id: string): HTMLSelectElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLSelectElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static SecimKutusu_Ogesi(id: string): HTMLOptionElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLOptionElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Div(id: string): HTMLDivElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLDivElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static IFrame(id: string): HTMLIFrameElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLIFrameElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static A(id: string): HTMLAnchorElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLAnchorElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static H(id: string): HTMLHeadingElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLHeadingElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static UL(id: string): HTMLUListElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLUListElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Span(id: string): HTMLSpanElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLSpanElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Form(id: string): HTMLFormElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLFormElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Tablo(id: string): HTMLTableElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLTableElement) {
            return el;
        }

        throw new Error("yok " + id);
    }
    public static Tablo_Hucre(id: string): HTMLTableCellElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLTableCellElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static Genel(id: string): HTMLElement {
        const el = document.getElementById(id);
        if (el instanceof HTMLElement) {
            return el;
        }

        throw new Error("yok " + id);
    }

    public static VarMi(id: string): boolean {
        const el = document.getElementById(id);
        return !!el;
    }
}