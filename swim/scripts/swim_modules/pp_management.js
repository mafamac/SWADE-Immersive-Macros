/*******************************************
 * Power Point Manager Reborn
 * v.0.0.0
 * By SalieriC#8263
 ******************************************/
export async function pp_management_script (message = false, item = false, actor = false) {
    const { speaker, _, __, token } = await swim.get_macro_variables()
    const claimedActor = game.user.character
    const officialClass = await swim.get_official_class()

    if (!message || !(item && actor)) {
        const actor = token ? token.actor : claimedActor
        const wizard = actor.items.find(e => e.type === "edge" && e.name.toLowerCase() === game.i18n.localize("SWIM.edge-wizard").toLowerCase())
        const soulDrain = actor.items.find(e => e.type === "edge" && e.name.toLowerCase() === game.i18n.localize("SWIM.edge-soulDrain").toLowerCase())
        let manualContent = game.i18n.localize("SWIM.dialogue-ppManagementManualContent") //inital option: pp input and subtract, aka manual pp management
        let options = `
            <option value="manual">${game.i18n.localize("SWIM.ppOption-manual")}</option>
            <option value="power">${game.i18n.localize("SWIM.ppOption-power")}</option>
            <option value="benny">${game.i18n.localize("SWIM.ppOption-benny")}</option>
        `
        if (soulDrain) { options += `<option value="soulDrain">${game.i18n.localize("SWIM.edge-soulDrain")}</option>` }
        if (wizard) { options += `<option value="wizard">${game.i18n.localize("SWIM.edge-wizard")}</option>` }

        const powers = actor.items.filter(p => p.type === "power")
        let powerOptions = ``
        let allOptions = {}
        for (let power of powers) {
            powerOptions += `<option value=${power.id}>${power.name}</option>`
            const actions = power.data.data.actions.additional //not iterable and path consists of IDs. ARGH!
        }

        //Main Dialogue
        new Dialog({
            title: game.i18n.localize("SWIM.dialogue-ppManagementTitle"),
            content: game.i18n.format("SWIM.dialogue-ppManagementContent", { class: officialClass, options: options, text: manualContent }),
            buttons: {
                one: {
                    label: `<i class="fas fa-magic"></i> ${game.i18n.localize("SWIM.button-proceed")}`,
                    callback: async (html) => {
                    }
                }
            },
            render: ([dialogContent]) => {
                $("#pp-dialogue").css("height", "auto"); // Adjust the dialogue to its content. Also fixes the error of scroll bar on first dialogue after login/reload.
                dialogContent.querySelector(`select[id="selected_option"`).focus();
                dialogContent.querySelector(`select[id="selected_option"`).addEventListener("input", (event) => {
                    const textInput = event.target;
                    const form = textInput.closest("form")
                    const effectContent = form.querySelector(".selectionContent");
                    const selectedOption = form.querySelector('select[id="selected_option"]').value;
                    if (selectedOption === "manual") { effectContent.innerHTML = manualContent }
                });
            },
            default: "one",
        }, {
            id: "pp-dialogue"
        }).render(true);
    }
}