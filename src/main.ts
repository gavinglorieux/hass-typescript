import "./utils";

import { LIB_AUTOMATION } from "@digital-alchemy/automation";
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import { HelloWorld } from "./hello-world";

const HAS_HAS = CreateApplication({
  name: "has_has",

  // Adding to this array will provide additional elements in TServiceParams for your code to use
  // - LIB_HASS - type safe home assistant interactions
  // - LIB_SYNAPSE - create helper entities (requires integration)
  // - LIB_AUTOMATION - extra helper utilities focused on home automation tasks (requires synapse)
  // - LIB_MQTT - listen & publish mqtt messages
  // - LIB_FASTIFY - http bindings
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],

  // add new services here
  // keys affect how app is wired together & log contexts
  // https://docs.digital-alchemy.app/docs/core/wiring
  services: {
    hello_world: HelloWorld,
  },
});

// add your app to the global modules list
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    has_has: typeof HAS_HAS;
  }
}

// Spin up service
await HAS_HAS.bootstrap({
  bootLibrariesFirst: true,
  configuration: {
    boilerplate: { LOG_LEVEL: "info" },
  },
});
