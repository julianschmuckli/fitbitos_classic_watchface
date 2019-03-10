function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold>{props.settingsStorage.getItem("t_custom_colors")}</Text>}>
        <Text>{props.settingsStorage.getItem("t_color_hoursminutes_hand")}</Text>
        <ColorSelect
          settingsKey="hoursminutesColor"
          centered={true}
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'blue'},
            {color: 'plum'},
            {color: 'white'},
            {color: 'green'},
            {color: 'lime'},
            {color: 'gray'},
            {color: 'lightgray'}
          ]}
        />
        <Text>{props.settingsStorage.getItem("t_color_seconds_hand")}</Text>
        <ColorSelect
          settingsKey="secondsColor"
          centered={true}
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'blue'},
            {color: 'plum'},
            {color: 'white'},
            {color: 'green'},
            {color: 'lime'},
            {color: 'gray'},
            {color: 'lightgray'}
          ]}
        />
      </Section>
      <Section>
        <Toggle
          settingsKey="alwaysOn"
          label={props.settingsStorage.getItem("t_always_on_display")}
        />
        <Toggle
          settingsKey="batteryCorner"
          label={props.settingsStorage.getItem("t_battery_corner")}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);
