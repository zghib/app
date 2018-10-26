/**
 * The Grand Directus Types To Whatever Database Type Mapping™
 */

import { i18n } from "./lang/";

export const datatypes = {
  mysql: {
    // String based
    // -------------------------------------------------------------------------
    CHAR: {
      length: true,
      defaultLength: 50,
      maxLength: 255,
      description: i18n.t("datatypes.mysql.CHAR"),
      fallbackInterface: "text-input"
    },

    VARCHAR: {
      length: true,
      defaultLength: 255,
      maxLength: 65535,
      description: i18n.t("datatypes.mysql.VARCHAR"),
      fallbackInterface: "text-input"
    },

    TINYTEXT: {
      description: i18n.t("datatypes.mysql.TINYTEXT"),
      fallbackInterface: "textarea"
    },

    TEXT: {
      description: i18n.t("datatypes.mysql.TEXT"),
      fallbackInterface: "textarea"
    },

    MEDIUMTEXT: {
      description: i18n.t("datatypes.mysql.MEDIUMTEXT"),
      fallbackInterface: "textarea"
    },

    LONGTEXT: {
      description: i18n.t("datatypes.mysql.LONGTEXT"),
      fallbackInterface: "textarea"
    },

    // Numeric
    // -------------------------------------------------------------------------
    TINYINT: {
      description: i18n.t("datatypes.mysql.TINYINT"),
      fallbackInterface: "toggle"
    },

    SMALLINT: {
      description: i18n.t("datatypes.mysql.SMALLINT"),
      fallbackInterface: "numeric"
    },

    MEDIUMINT: {
      description: i18n.t("datatypes.mysql.MEDIUMINT"),
      fallbackInterface: "numeric"
    },

    INT: {
      description: i18n.t("datatypes.mysql.INT"),
      fallbackInterface: "numeric"
    },

    BIGINT: {
      description: i18n.t("datatypes.mysql.BIGINT"),
      fallbackInterface: "numeric"
    },

    // Decimal Numbers
    // -------------------------------------------------------------------------
    DECIMAL: {
      decimal: true,
      description: i18n.t("datatypes.mysql.DECIMAL"),
      defaultDigits: 10,
      maxDigits: 65,
      defaultDecimals: 10,
      maxDecimals: 30,
      fallbackInterface: "numeric"
    },

    FLOAT: {
      decimal: true,
      description: i18n.t("datatypes.mysql.FLOAT"),
      defaultDigits: 10,
      defaultDecimals: 10,
      fallbackInterface: "numeric"
    },

    DOUBLE: {
      decimal: true,
      description: i18n.t("datatypes.mysql.DOUBLE"),
      defaultDigits: 10,
      defaultDecimals: 10,
      fallbackInterface: "numeric"
    },

    // Date and Time
    // -------------------------------------------------------------------------
    DATE: {
      description: i18n.t("datatypes.mysql.DATE"),
      fallbackInterface: "date"
    },

    DATETIME: {
      description: i18n.t("datatypes.mysql.DATETIME"),
      fallbackInterface: "datetime"
    },

    TIME: {
      description: i18n.t("datatypes.mysql.TIME"),
      fallbackInterface: "time"
    },

    TIMESTAMP: {
      description: i18n.t("datatypes.mysql.TIMESTAMP"),
      fallbackInterface: "time"
    },

    YEAR: {
      description: i18n.t("datatypes.mysql.YEAR"),
      fallbackInterface: "numeric"
    }
  }
};

export default {
  alias: {
    description: i18n.t("fieldtypes.alias"),
    mysql: {
      datatypes: null,
      default: null
    }
  },
  array: {
    description: i18n.t("fieldtypes.array"),
    mysql: {
      datatypes: ["VARCHAR"],
      default: "VARCHAR"
    }
  },
  boolean: {
    description: i18n.t("fieldtypes.boolean"),
    mysql: {
      datatypes: ["TINYINT"],
      default: "TINYINT"
    }
  },
  date: {
    description: i18n.t("fieldtypes.date"),
    mysql: {
      datatypes: ["DATE"],
      default: "DATE"
    }
  },
  datetime: {
    description: i18n.t("fieldtypes.datetime"),
    mysql: {
      datatypes: ["DATETIME"],
      default: "DATETIME"
    }
  },
  datetime_created: {
    description: i18n.t("fieldtypes.datetime_created"),
    mysql: {
      datatypes: ["DATETIME"],
      default: "DATETIME"
    }
  },
  datetime_updated: {
    description: i18n.t("fieldtypes.datetime_updated"),
    mysql: {
      datatypes: ["DATETIME"],
      default: "DATETIME"
    }
  },
  decimal: {
    description: i18n.t("fieldtypes.decimal"),
    mysql: {
      datatypes: ["DECIMAL", "FLOAT", "DOUBLE"],
      default: "DECIMAL"
    }
  },
  time: {
    description: i18n.t("fieldtypes.time"),
    mysql: {
      datatypes: ["TIME"],
      default: "TIME"
    }
  },
  file: {
    description: i18n.t("fieldtypes.file"),
    mysql: {
      datatypes: ["INT"],
      default: "INT"
    }
  },
  group: {
    description: i18n.t("fieldtypes.group"),
    mysql: {
      datatypes: null,
      default: null
    }
  },
  integer: {
    description: i18n.t("fieldtypes.integer"),
    mysql: {
      datatypes: ["TINYINT", "SMALLINT", "MEDIUMINT", "INT", "BIGINT"],
      default: "INT"
    }
  },
  json: {
    description: i18n.t("fieldtypes.json"),
    mysql: {
      datatypes: ["VARCHAR", "TINYTEXT", "TEXT", "MEDIUMTEXT", "LONGTEXT"],
      default: "TEXT"
    }
  },
  lang: {
    description: i18n.t("fieldtypes.lang"),
    mysql: {
      datatypes: ["CHAR", "VARCHAR"],
      default: "CHAR"
    }
  },
  m2o: {
    description: i18n.t("fieldtypes.m2o"),
    mysql: {
      datatypes: ["CHAR", "VARCHAR", "INT"],
      default: "INT"
    }
  },
  o2m: {
    description: i18n.t("fieldtypes.o2m"),
    mysql: {
      datatypes: null,
      default: null
    }
  },
  sort: {
    description: i18n.t("fieldtypes.sort"),
    mysql: {
      datatypes: ["TINYINT", "SMALLINT", "MEDIUMINT", "INT", "BIGINT"],
      default: "INT"
    }
  },
  status: {
    description: i18n.t("fieldtypes.status"),
    mysql: {
      datatypes: ["CHAR", "VARCHAR", "INT"],
      default: "VARCHAR"
    }
  },
  string: {
    description: i18n.t("fieldtypes.string"),
    mysql: {
      datatypes: [
        "CHAR",
        "VARCHAR",
        "TINYTEXT",
        "TEXT",
        "MEDIUMTEXT",
        "LONGTEXT"
      ],
      default: "VARCHAR"
    }
  },
  translation: {
    description: i18n.t("fieldtypes.translation"),
    mysql: {
      datatypes: null,
      default: null
    }
  },
  uuid: {
    description: i18n.t("fieldtypes.uuid"),
    mysql: {
      datatypes: ["VARCHAR"],
      default: "VARCHAR"
    }
  },
  user_created: {
    description: i18n.t("fieldtypes.user_created"),
    mysql: {
      datatypes: ["INT"],
      default: "INT"
    }
  },
  user_updated: {
    description: i18n.t("fieldtypes.user_updated"),
    mysql: {
      datatypes: ["INT"],
      default: "INT"
    }
  }
};
