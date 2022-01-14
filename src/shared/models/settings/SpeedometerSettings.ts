import { ISpeedometerSettings } from "../../interfaces/settings/ISpeedometerSettings";

export class SpeedometerSettings implements ISpeedometerSettings {
    hud_slope: boolean = false;
    hud_gauge: boolean = false;
    hud_speed: boolean = false;
    hud_distance: boolean = false;
    hud_acceleration: boolean = false;
    hud_angles: boolean = false;
    hud_angles_bubbles: boolean = false;
    hud_drift_hold: boolean = false;
    enable_livesplit_hotkey: boolean = false;
    enable_ghost_keys: boolean = false;
    speed_in_3D: boolean = false;
    log: boolean = false;
    hud_angles_airboost: boolean = false;
    hud_max_speed: boolean = false;
}