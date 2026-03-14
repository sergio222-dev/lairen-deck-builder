import styleContent from './DialogYesNo.css?inline';

export class DialogYesNoNo extends HTMLElement {
    private readonly dialog: HTMLDialogElement;
    private handlers: Array<() => void> = [];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });

        // load sync styles for this component in the shadowRealm
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(styleContent)
        shadowRoot.adoptedStyleSheets = [sheet]

        this.dialog           = document.createElement("dialog");
        this.dialog.innerHTML = `
        <slot name="yesNo"> ? </slot>
        <div class="dialog_button_container">
            <button class="dialog_button" part="button" id="yesno-yes">Yes</button>
            <button class="dialog_button" id="yesno-no">No</button>
        </div>
        `

        shadowRoot.appendChild(this.dialog);
    }

    open(message: string): Promise<boolean> {

        const slotContent = this.dialog.querySelector('slot[name="yesNo"]');

        if (!slotContent) throw new Error(`No slot defined in DialogYesNo`);

        slotContent.innerHTML = message;

        const yesButton = this.dialog.querySelector('#yesno-yes')!
        const noButton  = this.dialog.querySelector('#yesno-no')!

        this.removeListener(yesButton);
        this.removeListener(noButton);

        this.handlers = [];

        this.dialog.showModal();

        return new Promise((resolve) => {
            const yesButton = this.dialog.querySelector('#yesno-yes')!
            const noButton  = this.dialog.querySelector('#yesno-no')!

            const accept = () => {
                resolve(true);
                this.close()
            };
            const cancel = () => {
                resolve(false)
                this.close()
            };

            this.handlers.push(accept);
            this.handlers.push(cancel);

            yesButton.addEventListener('click', accept)

            noButton.addEventListener('click', cancel)
        })
    }

    close(): void {
        this.dialog.close();
    }

    private removeListener(el: Element): void {
        this.handlers.forEach(handler => {
            el.removeEventListener('click', handler);
        });
    }
}
