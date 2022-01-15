import React from 'react';
import Window from './window/window';
import Section from './window/section';
import Checkbox from './settings/IconCheckbox';

import getSetting from './helpers/getSetting';
import EventButton from './window/EventButton';

import './configuration.css';

const { ipcRenderer } = window.require('electron')

interface IProps {

}

interface IState {
  settings: any;
}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      settings: {
        getSetting: function() {}
      }
    };
    this.settingsListener = this.settingsListener.bind(this);
    ipcRenderer.on('setsettings', this.settingsListener);
    ipcRenderer.send('getsettings', true);
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('setsettings');
  }

  settingsListener(event: any, data: any) {
    this.setState({settings: data});
  }

  render () {
    return (
        <Window title="Configuration" path="config">
          <Section title="Speedometer">
            
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show slope', 'speedometer.hud_slope', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show gauge', 'speedometer.hud_gauge', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show speed', 'speedometer.hud_speed', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show distance', 'speedometer.hud_distance', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show accelleration', 'speedometer.hud_acceleration', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show angles', 'speedometer.hud_angles', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show angle orbs', 'speedometer.hud_angles_bubbles', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show drift hold', 'speedometer.hud_drift_hold', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Enable livesplit hotkeys', 'speedometer.enable_livesplit_hotkey', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Enable ghost hotkeys', 'speedometer.enable_ghost_keys', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Measure speed in 3D', 'speedometer.speed_in_3D', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Log to file (need if want to upload)', 'speedometer.log', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show airboost helper', 'speedometer.hud_angles_airboost', false)}/>
            <Checkbox className="setting" setting={getSetting(this.state.settings, 'Show max speed on gauge', 'speedometer.hud_max_speed', false)}/>
          </Section>
          <Section title="Rendering">
            <Checkbox setting={getSetting(this.state.settings, 'Show debug boxes', "render.debugBoxes", false)}/>
            <Checkbox setting={getSetting(this.state.settings, 'Show marker names', "render.showMarkerNames", false)}/>
          </Section>
          <Section title="Overlay">
            <Checkbox setting={getSetting(this.state.settings, 'Check for new versions', "overlaySettings.checkForUpdates", true)} />
            <Checkbox setting={getSetting(this.state.settings, 'Automatically update to new versions', "overlaySettings.autoUpdate", true)}/>
          </Section>
          <Section title="Development" expanded={false}>
            <Section title="Dev tools">
                <EventButton text="Renderer" event="debugrenderer" value="true"/>
                <EventButton text="Configuration" event="debug-window" value="config" />
                <EventButton text="Markers" event="debug-window" value="marks"/>
              </Section>
              <Section title="Experimental" expanded={false}>
                <EventButton text="Reload renderer" event="reloadRender" value="true"/>
                <EventButton text="Restart overlay" event="restart" value="true"/>
              </Section>
          </Section>
        </Window>
    );
  }
}

export default App;