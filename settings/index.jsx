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
            {color: 'plum'},
            {color: 'white'},
            {color: 'green'},
            {color: 'magenta'},
            {color: 'lime'},
            {color: 'gray'},
            {color: 'lightgray'}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);