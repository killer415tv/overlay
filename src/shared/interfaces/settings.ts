
import { IRenderData } from './render/renderdata';
import { IMarkerGroupSettings } from './settings/IMarkerGroupSettings';
import { IRenderSettings } from './settings/IRenderSettings';
import { ISpeedometerSettings } from './settings/ISpeedometerSettings';

export interface IRuntimeSettings {
  map: string | null;
}

export interface ISettings {
  render: IRenderSettings;
  marks: Array<IMarkerGroupSettings>;
  speedometer: ISpeedometerSettings;
  runtimeData: IRuntimeSettings | null;

  createRenderData(MapId: string): IRenderData;
}