import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// Functions to calculate the distance
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// function needed to calculate the distance to the store
function toRad(Value) {
    return Value * Math.PI / 180;
}

export default class MarkfeeBanner extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          externalData: null,
        };
    }

    componentDidMount() {
        // shop_index specifies the index of the shop to be shown
        var shop_index = this.props.shopIndex;
        var apiEndpoint = 'https://api.emmas.app/rest/geolocations?zipcode=' + this.props.zipcode;
        // API Call to the geolocations endpoint
        fetch(apiEndpoint, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((geoResponseJson) => {
            // API Call to the providers endpoint
            fetch('https://api.emmas.app/rest/providers?lat=' + encodeURIComponent(geoResponseJson["latitude"]) + '&limit=25&lon=' + encodeURIComponent(geoResponseJson["longitude"]) + '&range=10000', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((shopResponseJson) => {
            var data = {
            name: 'nameDefault',
            logo: 'logoDefault',
            picture: 'pictureDefault',
            category: 'categoryDefault',
            minOrderValue: 'min_valueDefault',
            distance: 'distanceDefault'
        };
            // for each loop on the array of shops. Can alsp be replaced by just one index which is defined in the variable shopIndex
            //for(var shop_index in shopResponseJson) {
            // The shops name
            data.name = shopResponseJson[shop_index]["name"];
            // The URL of the shops Logo
            data.logo = shopResponseJson[shop_index]["design"]["logoUrl"];
            // The URL of the shops Picture
            data.picture = shopResponseJson[shop_index]["design"]["pictureUrl"];
            // The shops category
            data.category = shopResponseJson[shop_index]["category"];
            // The distance as a float in kilometers
            data.minOrderValue = shopResponseJson[shop_index]["settings"]["minOrderValue"];
            // The distance as a float in kilometers
            data.distance =
            calcCrow(
                geoResponseJson["latitude"],
                geoResponseJson["longitude"],
                shopResponseJson[shop_index]["contact"]["geoLocation"]["latitude"],
                shopResponseJson[shop_index]["contact"]["geoLocation"]["longitude"]
            )
            this.setState({ externalData: data });
            })
        
            // error handling for the provider request
            //If response is not in json then in error
        .catch((error) => {
            //Error
            console.error(error);
        });
        })
        // error handling for the geolocations request
        //If response is not in json then in error
        .catch((error) => {
            //Error
            console.error(error);
        });
      }

    render () {
        if (this.state.externalData === null) {
            return (
              <View></View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={[styles.flexContainer, styles.blackBorder]}>
                        <View style={styles.topRow}> 
                            <Image style={[styles.backgroundImage]} source={{uri: this.state.externalData.picture}} />
                        </View>
                        <View style={styles.bottomRow}>
                            <Image style={[styles.image, styles.blackBorder]} source={{uri: this.state.externalData.logo}} />
                            <View style={styles.textarea}>
                                <Text style={[styles.boldText, styles.greyText, styles.lineMargin]}>{this.state.externalData.category}</Text>
                                <Text style={[styles.boldText, styles.lineMargin, {fontSize: 18}]}>{this.state.externalData.name}</Text>
                                <Text style={[styles.boldText, styles.greyText, styles.lineMargin]}>{(Math.round(this.state.externalData.distance * 10) / 10).toFixed(1)} km von dir entfernt | MBW {(Math.round(this.state.externalData.minOrderValue * 100) / 100).toFixed(2)} €</Text>
                                <Text style={[styles.description]}>Jetzt regionale Produkte über <Text style={[styles.boldText]}>Marktfee.app</Text> kaufen und 20% mit Code <Text style={[styles.boldText]}>HEYANNA10</Text> sparen</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

}

const styles = StyleSheet.create({
    container: {
        width: 350,
        minHeight: 310,
        marginLeft: 12
    },
    flexContainer: {
        flex: 1,
    },
    topRow: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    bottomRow: {
        flex: 13,
        paddingHorizontal: 15,
        borderTopColor: 'black',
        borderTopWidth: 1
    },
    image: {
        width: 66,
        height: 66,
        overflow: 'hidden',
        position: 'absolute',
        top: -33,
        marginLeft: 15,
        borderRadius: 40
    },
    blackBorder: {
        borderColor: 'black',
        borderWidth: 1
    },
    textarea: {
        marginTop: 40
    },
    boldText: {
        fontWeight: 'bold'
    },
    greyText: {
        color: '#878282',
        fontSize: 16
    },
    lineMargin: {
        marginBottom: 2
    },
    description: {
        marginTop: 8,
        fontWeight: '500'
    }
});
