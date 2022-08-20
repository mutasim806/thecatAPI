import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { Dropdown } from 'react-native-element-dropdown'
import ImageViewer from 'react-native-image-zoom-viewer'

//Config
import { Config } from '@/Config'

const ExampleContainer = () => {
  const { Common, Fonts, Gutters, Layout } = useTheme()

  const {
    regularHPadding,
    regularTMargin,
    tinyTMargin,
    small2xVMargin,
    large2xBMargin,
    regular2xTMargin,
    small2xHMargin,
    smallHPadding,
  } = Gutters
  const { border, borderRadius, alignEnd, borderRadius15 } = Common
  const { textRegular } = Fonts
  const { justifyContentAround, fill } = Layout

  const [data, setData] = useState(false)
  const [allBreeds, setAllBreeds] = useState([])
  const [filter, setFilter] = useState(false)
  const [imageModel, setImageModel] = useState(false)
  const [imageViewer, setImageViewer] = useState(false)

  var options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': Config.API_KEY,
    },
  }

  useEffect(() => {
    getCatsAPI()
    getBreedsAPI()
  }, [])

  const getCatsAPI = () => {
    fetch(`${Config.API_URL}/images/search?limit=10`, options)
      .then(response => response.json())
      .then(json => setData(json))
      .catch((error) => {})
  }

  const getBreedsAPI = () => {
    fetch(`${Config.API_URL}/breeds`, options)
      .then(response => response.json())
      .then(json => getallBreeds(json))
      .catch((err) => {})
  }

  const getallBreeds = data => {
    const breedsList =
      data &&
      data.map(item => {
        return {
          label: item.name,
          value: item.id,
          url: item.image?.url,
        }
      })
    setAllBreeds(breedsList)
  }

  const openImage = item => {
    setImageViewer([item])
    setImageModel(!imageModel)
  }

  return (
    <ScrollView
      style={fill}
      contentContainerStyle={[fill, smallHPadding]}
    >
      <View style={[regularTMargin]}>
        <Dropdown
          data={allBreeds}
          style={[regularHPadding, border, borderRadius]}
          labelField="label"
          valueField="value"
          value={filter}
          onChange={value => setFilter(value)}
          placeholder="Select Breed"
        />
        {filter && (
          <TouchableOpacity
            onPress={() => setFilter(false)}
            style={[tinyTMargin, alignEnd]}
          >
            <Text style={{ color: 'green' }}>clear filter</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[small2xVMargin, large2xBMargin]}>
        {filter ? (
          <TouchableOpacity
            style={[regular2xTMargin]}
            onPress={() => openImage(filter)}
          >
            <Image
              source={{ uri: filter.url }}
              style={[borderRadius15, { width: 150, height: 150 }]}
            />
          </TouchableOpacity>
        ) : (
          <FlatList
            numColumns={2}
            data={data}
            columnWrapperStyle={[justifyContentAround]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[regular2xTMargin]}
                onPress={() => openImage(item)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={[borderRadius15, { width: 150, height: 150 }]}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
      <Modal
        visible={imageModel}
        transparent={true}
        onBackdropPress={() => setImageModel(!imageModel)}
      >
        <View style={{ flex: 1 }}>
          <ImageViewer imageUrls={imageViewer} enableImageZoom={true} />
          <TouchableOpacity
            onPress={() => setImageModel(false)}
            style={[
              small2xHMargin,
              {
                position: 'absolute',
                marginTop: 40,
              },
            ]}
          >
            <Text style={[textRegular, { color: 'red' }]}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default ExampleContainer
