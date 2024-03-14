// @ts-check
import { PgExecutor, TYPES, makeRegistry, recordCodec } from "@dataplan/pg";
import { constant, context, object } from "grafast";
import { sql } from "pg-sql2";
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: "pgSettings" != null ? ctx.get("pgSettings") : constant(null),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const folderFilesCodec = recordCodec({
  name: "folderFiles",
  identifier: sql.identifier("abecc", "folder_files"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {
          behavior: ["-attribute:insert -attribute:update"]
        }
      }
    },
    folderId: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    fileId: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          behavior: ["-filterBy -orderBy"]
        }
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "233506",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "folder_files"
    },
    tags: Object.create(null)
  },
  executor
});
const foldersCodec = recordCodec({
  name: "folders",
  identifier: sql.identifier("abecc", "folders"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {
          behavior: ["-attribute:insert -attribute:update"]
        }
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          behavior: ["-filterBy -orderBy"]
        }
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "233490",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "folders"
    },
    tags: Object.create(null)
  },
  executor
});
const filesCodec = recordCodec({
  name: "files",
  identifier: sql.identifier("abecc", "files"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {
          behavior: ["-attribute:insert -attribute:update"]
        }
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          behavior: ["-filterBy -orderBy"]
        }
      }
    },
    modifiedAt: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          behavior: ["-filterBy -orderBy"]
        }
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "233498",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "files"
    },
    tags: Object.create(null)
  },
  executor
});
const registryConfig_pgResources_folder_files_folder_files = {
  executor,
  name: "folder_files",
  identifier: "main.abecc.folder_files",
  from: folderFilesCodec.sqlType,
  codec: folderFilesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }, {
    isPrimary: false,
    attributes: ["folderId", "fileId"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "folder_files"
    },
    tags: {}
  }
};
const registryConfig_pgResources_folders_folders = {
  executor,
  name: "folders",
  identifier: "main.abecc.folders",
  from: foldersCodec.sqlType,
  codec: foldersCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "folders"
    },
    tags: {}
  }
};
const registryConfig_pgResources_files_files = {
  executor,
  name: "files",
  identifier: "main.abecc.files",
  from: filesCodec.sqlType,
  codec: filesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "abecc",
      name: "files"
    },
    tags: {}
  }
};
export const pgRegistry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    folderFiles: folderFilesCodec,
    int4: TYPES.int,
    folders: foldersCodec,
    text: TYPES.text,
    files: filesCodec,
    timestamptz: TYPES.timestamptz
  }),
  pgResources: Object.assign(Object.create(null), {
    folder_files: registryConfig_pgResources_folder_files_folder_files,
    folders: registryConfig_pgResources_folders_folders,
    files: registryConfig_pgResources_files_files
  }),
  pgRelations: Object.assign(Object.create(null), {
    files: Object.assign(Object.create(null), {
      folderFilesByTheirFileId: {
        localCodec: filesCodec,
        remoteResourceOptions: registryConfig_pgResources_folder_files_folder_files,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["fileId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: ["-list -connection -single -manyToMany"]
          }
        }
      }
    }),
    folderFiles: Object.assign(Object.create(null), {
      filesByMyFileId: {
        localCodec: folderFilesCodec,
        remoteResourceOptions: registryConfig_pgResources_files_files,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["fileId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      foldersByMyFolderId: {
        localCodec: folderFilesCodec,
        remoteResourceOptions: registryConfig_pgResources_folders_folders,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["folderId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    folders: Object.assign(Object.create(null), {
      folderFilesByTheirFolderId: {
        localCodec: foldersCodec,
        remoteResourceOptions: registryConfig_pgResources_folder_files_folder_files,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["folderId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    })
  })
});