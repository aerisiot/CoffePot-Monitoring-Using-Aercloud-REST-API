import React, { Component } from 'react';
import { AppRegistry, StyleSheet,Image, Text, View, DeviceEventEmitter, Linking, Dimensions, TouchableHighlight,Platform } from 'react-native'

import moment from 'moment';

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const ASPECT_RATIO = deviceWidth / deviceHeight;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class AercloudIoTCoffeePotSolution extends Component {

constructor(props) {
  super(props);
  this._getAerCloudEvents = this._getAerCloudEvents.bind(this);
  this._aerPortStatus = this._aerPortStatus.bind(this);
  this._getDatausage = this._getDatausage.bind(this);

  this.state = {
    potStatus : 'None',
    eventTime:0,
    iccid:'',
    lastConnected:'',
    dataUsage:0
  }
}



   componentDidMount() {
      this._aerPortStatus();
      this._getDatausage();

  //    let networkResponse;
  //    this._aerPortStatus().then(result=>networkResponse = result);

      this._interval = setInterval(() => this._getAerCloudEvents(),10000);
   }

   componentWillMount() {
      clearInterval(this._interval);
    }

  findLayoutSize(layout) {
      const {x, y, width, height} = layout;
  }

_checkError(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

  _getAerCloudEvents() {

  let deviceID = '<your deviceID>';
  let accountID = '<your accountID>';
  let apiKey = '<your Aercloud API key>';
  let containerName = '<your containerName>';

  let aerCloudURL ='http://api.aercloud.aeris.com/v1/' + accountID + '/scls/' + deviceID + '/containers/' + containerName + '/contentInstances/?apiKey=' + apiKey;

  fetch(aerCloudURL)
  .then(response => response.json())
  .then((json) => this._handleAercloudResponse(json.contentInstances))
  .catch(error =>alert(JSON.stringify(error)));
}

_handleAercloudResponse(response) {

  let pot_status = JSON.parse(response[0].content.contentTypeBinary).value;
  let EventTime = response[0].creationTime;

  this.setState({potStatus:pot_status,eventTime:EventTime});
}

_aerPortStatus() {

  let accountID = '<your accountID>';
  let deviceProfileId = '<your deviceProfileId>';
  let apiKey = '<your Aercloud API key>';
  let emailId = '<your email id>';

  let aerPortURL = 'http://iotapi.m2mweb.net:9080/AerAdmin_WS_5_0/rest/devices/network/details?accountID=' + accountID + '& deviceProfileId=' + deviceProfileId + '&email=' + emailId + '&apiKey=' + apiKey;
  console.log(aerPortURL);

  fetch(aerPortURL)
  .then(response => response.json())
  .then((json) => this._handleAerportResponse(json))
  .catch(error =>alert(JSON.stringify(error)));

}

_getDatausage() {

  let accountID = '<your accountID>';
  let deviceProfileId = '<your deviceProfileId>';
  let apiKey = '<your Aercloud API key>';
  let emailId = '<your email id>';
  let monthStartDate = '<month start date>';
  let monthEndDate = '<month start date>';

  let aerAnalyticsURL = 'https://api-analytics.aeriscloud.com/search/subscription/detail/monthly?accountId=' + accountID + '&apiKey=' + apiKey + '&searchValue=' + accountID + '&startDate=' + monthStartDate + '&endDate=' + monthEndDate + '&searchCriteria=SUBSCRIPTION_ID';

  fetch(aerAnalyticsURL)
  .then(response => response.json())
  .then((json) => this._handleAerAnalyticsResponse(json))
  .catch(error =>alert(JSON.stringify(error)));

}

_handleAerportResponse(response) {
   this.setState({iccid:response.networkResponse[0].ICCID,lastConnected:response.networkResponse[0].dataSession.lastStopTime});
}

_handleAerAnalyticsResponse(response) {
   this.setState({dataUsage:response.data[0].total_bytes_transferred});
}

  render() {

    if (this.state.potStatus === 'FULL') {
      coffeePot=<Image source={require('./resources/FullPot.png')} style={styles.image}/>
    } else if (this.state.potStatus === 'HALF') {
      coffeePot=<Image source={require('./resources/HalfPot.png')} style={styles.image}/>
    } else {
      coffeePot=<Image source={require('./resources/EmptyPot.png')} style={styles.image}/>
    }

    return (
      <View style={styles.container} onLayout={ (event) => { this.findLayoutSize(event.nativeEvent.layout)}}>
                <Text style={styles.description}>
                  Aeris Connectivity
                </Text>
                <View style={{alignItems:'center'}}>
                      <View style={styles.row}>
                            <View style={styles.detailBox}>
                                <Text style={styles.detail}>
                                ICCID
                              </Text>
                              <Text style={styles.detail}>
                                {this.state.iccid}
                              </Text>
                           </View>
                      </View>
                      <View style={styles.row}>

                          <View style={styles.detailBox}>
                              <Text style={styles.detail}>
                                Data Usage(MB)
                              </Text>
                              <Text style={styles.detail}>
                                {Math.floor((this.state.dataUsage/1000)/1000)}
                              </Text>
                          </View>
                          <View style={styles.detailBox}>
                          <Text style={styles.detail}>
                            Last Connected
                          </Text>
                          <Text style={styles.detail}>
                            {this.state.lastConnected}
                          </Text>
                          </View>
                    </View>
                    <Text style={styles.description2}>
                      Coffee Pot Status
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detail}>
                          Level
                        </Text>
                        <Text style={styles.detail}>
                          {this.state.potStatus}
                        </Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detail}>
                          Level Timestamp
                        </Text>
                        <Text style={styles.detail}>
                        {moment(this.state.eventTime).format("MM-DD-YY h:mm:ss")}
                        </Text>
                      </View>
                  </View>
                  {coffeePot}
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    container:{
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'azure',
      marginTop: 0
    },
    row: {
      flex:1,
      width:deviceWidth,
      flexDirection:'row',
      alignItems:'flex-start',
      justifyContent:'space-between',
      marginTop:2,
      marginBottom:2,
      alignSelf: 'stretch'
    },
    detailBox: {
      padding:15,
      height:40,
      justifyContent:'center'
    },
    button: {
      marginLeft:10,
      marginRight:10,
      marginTop:1,
      backgroundColor:'#0C0',
      borderRadius:10,
      alignItems:'center',
      justifyContent:'center',
      padding:5,
      width:(deviceWidth/2)-40
    },
    text: {
      fontFamily:'Futura',
      fontSize:15,
      color :'#4b0082'
    },
    detail: {
      fontFamily:'Futura',
      fontSize:15,
      fontWeight:'bold',
      color :'#4b0082'
    },
    json: {
      fontSize: 12,
      fontFamily: 'Courier',
      textAlign: 'center',
      fontWeight:'bold'
    },
    description: {
      fontFamily:'Futura',
      fontSize:15,
      marginTop : 15,
      fontWeight:'bold',
      color :'dodgerblue'
    },
    description2: {
      fontFamily:'Futura',
      fontSize:15,
      fontWeight:'bold',
      marginBottom :5,
      color :'darkgreen'
    },
    image: {
      marginBottom :30
    }
});

AppRegistry.registerComponent('AercloudIoTCoffeePotSolution', () => AercloudIoTCoffeePotSolution);
