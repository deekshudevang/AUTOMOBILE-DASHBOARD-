import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface FiveMVehicleMetaRecord {
  modelName: string;
  gameName?: string;
  handlingId?: string;
  vehicleMakeName?: string;
  modelHash?: number;
  rawXmlObj: any;
}

export class FiveMMetadataParser {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      trimValues: true,
      parseTagValue: true
    });
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      format: true,
      indentBy: "  "
    });
  }

  parseVehiclesMeta(xmlContent: string): FiveMVehicleMetaRecord[] {
    const records: FiveMVehicleMetaRecord[] = [];
    try {
      const parsed = this.parser.parse(xmlContent);
      const root = parsed.CVehicleModelInfo__InitDataList || parsed.CVehicleModelInfoArgs;
      if (!root) return records;

      const items = root.InitDatas?.Item || root.item || [];
      const itemArr = Array.isArray(items) ? items : [items];

      for (const item of itemArr) {
        if (item && item.modelName) {
          records.push({
            modelName: String(item.modelName),
            gameName: item.gameName ? String(item.gameName) : undefined,
            handlingId: item.handlingId ? String(item.handlingId) : undefined,
            vehicleMakeName: item.vehicleMakeName ? String(item.vehicleMakeName) : undefined,
            rawXmlObj: item
          });
        }
      }
    } catch (err) {
      console.error('Failed to parse vehicles.meta XML:', err);
    }
    return records;
  }

  serializeToXml(rootTag: string, obj: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n` + this.builder.build({ [rootTag]: obj });
  }
}

