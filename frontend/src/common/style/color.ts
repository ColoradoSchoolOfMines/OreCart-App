export default {
  orecart: {
    tungsten: "#CC4628",
    silver: "#879EC3",
    gold: "#F1B91A",
    get: (name: string): string | undefined => {
      switch (name) {
        case "Tungsten":
          return "#CC4628";
        case "Silver":
          return "#879EC3";
        case "Gold":
          return "#F1B91A";
        default:
          return undefined;
      }
    },
  },
  csm: {
    primary: {
      dark_blue: "#21314D",
      blaster_blue: "#09396C",
      light_blue: "#879EC3",
      colorado_red: "#CC4628",
      pale_blue: "#CFDCE9",
      ext: {
        blaster_blue_highlight: "#235D99",
      },
    },
    neutral: {
      white: "white",
      light_gray: "#AEB3B8",
      silver: "#AEB3B8",
    },
  },
  generic: {
    white: "white",
    black: "black",
    selection: "#EEEEEE",
    skeleton: "#DDDDDD",
    location: "#148D00",
    alert: {
      primary: "#FF5151",
      pressed: "#ED4B4B",
      elevated: "#FF7575",
    },
  },
};
