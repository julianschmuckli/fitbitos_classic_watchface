function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold>Custom colors</Text>}>
        <Text>Hours- and minutes hand</Text>
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
        <Text>Seconds hand</Text>
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
          label="Activate Always-On Display"
        />
        <Toggle
          settingsKey="batteryCorner"
          label="Show battery indicator"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);
