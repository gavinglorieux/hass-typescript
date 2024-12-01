import { TServiceParams } from "@digital-alchemy/core";

const EVENING_MAX_BRIGHTNESS = 255 * 0.3;
const NIGHT_MAX_BRIGHTNESS = 255 * 0.15;
const MORNING_MAX_BRIGHTNESS = 255 * 0.4;
const DAY_BRIGHTNESS = 100;

export async function HelloWorld({ hass, logger, automation }: TServiceParams) {
  // const bBedroomLamps = hass.refBy.id("light.basement_bedroom");

  // await hass.call.notify.notify({
  //   message: `Your lights are currently ${bBedroomLamps.state}!`,
  //   title: "Hello world 🔮",
  // });

  hass.entity
    .listEntities("light")
    .filter(id => {
      if (id === "light.all_lights") return false;
      const entity = hass.refBy.id(id);
      return !("lights" in entity.attributes);
    })
    .map(id => {
      const entity = hass.refBy.id(id);

      entity.onUpdate(async ({ state, attributes, entity_id }) => {
        if (state !== "on") return;

        logger.info(`${entity_id} turned on with brightness ${attributes.brightness}`);

        // Morning
        if (
          automation.solar.isBetween("dawn", "solarNoon") &&
          automation.time.isBefore("AM9") &&
          "brightness" in attributes &&
          attributes.brightness > MORNING_MAX_BRIGHTNESS
        ) {
          logger.info(`Setting brightness to 30% for ${entity_id}`);
          await entity.turn_on({ brightness: MORNING_MAX_BRIGHTNESS });
        }

        // Day
        else if (automation.solar.isBetween("sunrise", "sunset")) {
          logger.info(`Setting brightness to ${DAY_BRIGHTNESS}% for ${entity_id}`);
          await entity.turn_on({ brightness: DAY_BRIGHTNESS });
        }

        // Evening
        else if (
          automation.solar.isBetween("nightStart", "nightEnd") &&
          automation.time.isBefore("PM11:45") &&
          "brightness" in attributes &&
          attributes.brightness > EVENING_MAX_BRIGHTNESS
        ) {
          logger.info(`Setting brightness to ${EVENING_MAX_BRIGHTNESS} for ${entity_id}`);
          await entity.turn_on({ brightness: EVENING_MAX_BRIGHTNESS });
        }

        // Night
        else if (
          automation.solar.isBetween("nightStart", "dawn") &&
          automation.time.isAfter("AM12") &&
          "brightness" in attributes &&
          attributes.brightness > NIGHT_MAX_BRIGHTNESS
        ) {
          logger.info(`Setting brightness to ${NIGHT_MAX_BRIGHTNESS} for ${entity_id}`);
          await entity.turn_on({ brightness: NIGHT_MAX_BRIGHTNESS });
        }
      });
    });
}
