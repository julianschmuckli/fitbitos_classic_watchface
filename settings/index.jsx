function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">{props.settingsStorage.getItem("t_color_seconds_hand")}</Text>}>
        <ColorSelect
          settingsKey="myColor"
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
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);