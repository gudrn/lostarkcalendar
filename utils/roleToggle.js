export const roleToggle = {
    ROLE_ID: "1410108934777344031", // 골드섬 알림 역할 ID

    buildButtons(ActionRowBuilder, ButtonBuilder, ButtonStyle) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("gold_on")
                    .setLabel("골드섬 알림 ON")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("gold_off")
                    .setLabel("골드섬 알림 OFF")
                    .setStyle(ButtonStyle.Danger),
            );
    }
};
