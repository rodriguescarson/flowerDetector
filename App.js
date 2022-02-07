import React, { Component } from 'react'
import {
  View, Text, Image, StyleSheet
} from 'react-native'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import Tflite from 'tflite-react-native';

let tflite = new Tflite();
var modelFile = 'models/model.tflite'
var labelsFile = 'models/labels.txt'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      recognitions: null,
      source: null
    }
    tflite.loadModel({ model: modelFile, labels: labelsFile }, (err, res) => {
      if (err) console.log(err)
      else console.log(res)
    })
  }

  selectGalleryImage() {
    const options = {}
    launchImageLibrary(options, (response) => {
      if (response.didCancel) { console.log('User Cancelled') }
      else if (response.error) {
        console.log('Image Picker Error')
      } else if (response.customButton) {
        console.log('User pressed custom button')
      } else {
        this.setState({ source: { uri: response.assets[0].uri } })


        tflite.runModelOnImage(
          {
            path: response.assets[0].uri,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) console.log(err)
            else {
              this.setState({ recognitions: res[res.length - 1] })
            }
          })
      }
    })
  }

  takeImage() {
    const options = {}
    launchCamera(options, (response) => {
      console.log(response + "")
      if (response.didCancel) { console.log('User Cancelled') }
      else if (response.error) {
        console.log('Image Picker Error')
      } else if (response.customButton) {
        console.log('User pressed custom button')
      } else {
        this.setState({ source: { uri: response.assets[0].uri } })


        tflite.runModelOnImage(
          {
            path: response.assets[0].uri,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) console.log(err)
            else {
              this.setState({ recognitions: res[res.length - 1] })
            }
          })
      }
    })
  }
  render() {
    const { recognitions, source } = this.state
    return (
      <LinearGradient colors={['#a8e063', '#56ab2f']} style={styles.linerarGradient}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Find FLowers
          </Text>
          <Text style={styles.subtitle}>
            Python Neural Network
          </Text>
        </View>
        <View style={styles.imageContainer}>
          {
            recognitions ? <View>
              <Image source={source}
                style={styles.flowerImage}
              ></Image>
              <Text style={{ color: 'white', textAlign: 'center', paddingTop: 10, fontSize: 25 }}>
                {recognitions['label'] + ' - ' + (recognitions['confidence'] * 100).toFixed(0) + '%'}
              </Text>
            </View> :
              <Image
                source={require('./assets/flower.png')}
                style={styles.flowerImage}></Image>
          }

        </View>
        <View style={styles.buttonContainer}>
          <Button
            title='Camera Roll'
            buttonStyle={styles.button}
            containerStyle={{ margin: 5 }}
            titleStyle={{ fontSize: 20 }}
            onPress={this.selectGalleryImage.bind(this)}
          ></Button>
          <Button
            title='Take a Photo'
            buttonStyle={styles.button}
            containerStyle={{ margin: 5 }}
            titleStyle={{ fontSize: 20 }}
            onPress={this.takeImage.bind(this)}
          ></Button>
        </View>
      </LinearGradient >
    )
  }
}

const styles = StyleSheet.create({
  linerarGradient: {
    flex: 1
  },
  button: {
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8
  },
  titleContainer: {
    marginTop: 70,
    marginLeft: 40
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white'
  },
  subtitle: {
    color: 'white',
    fontSize: 16
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'

  },
  flowerImage: {
    width: 250,
    height: 250
  }
})