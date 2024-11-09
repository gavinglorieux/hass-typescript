import { TServiceParams, sleep } from "@digital-alchemy/core";

export async function HelloWorld({ hass, lifecycle }: TServiceParams) {
  const bBedroomLamps = hass.refBy.id("light.basement_bedroom");

  await hass.call.notify.notify({
    message: `Your lights are currently ${bBedroomLamps.state}!`,
    title: "Hello world 🔮",
  });

  // eslint-disable-next-line unicorn/no-array-for-each
  hass.entity.listEntities("light").forEach(async id => {
    const entity = hass.refBy.id(id);
    await entity.toggle();
    await sleep(2000);
    await entity.toggle();
  });
}
