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
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Dropdown } from 'react-native-element-dropdown'

const ExampleContainer = props => {
  const { Common, Fonts, Gutters, Layout } = useTheme()

  const [data, setData] = useState(false)
  const [allBreeds, setAllBreeds] = useState([])
  const [filter, setFilter] = useState(false)

  var options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': '079bd626-4ae4-4173-b28b-4c1a3ac5f131',
    },
    // body: JSON.stringify({
    //   'client_id': '(API KEY)',
    //   'client_secret': '(API SECRET)',
    //   'grant_type': 'client_credentials'
    // })
  }

  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/images/search?limit=10', options)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error))
    // .finally(() => setLoading(false));

    getBreedsAPI()
  }, [])

  const getBreedsAPI = () => {
    fetch('https://api.thecatapi.com/v1/breeds', options)
      .then(response => response.json())
      .then(json => getallBreeds(json))
      .catch(err => console.log('breed err', err))
  }

  const getallBreeds = data => {
    const breedsList =
      data &&
      data.map(item => {
        return {
          label: item.name,
          value: item.id,
          image: item.image?.url,
        }
      })
    setAllBreeds(breedsList)
  }

  console.log('allBreeds', allBreeds)
  console.log('data', data)

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Layout.fill,
        // Layout.colCenter,
        Gutters.smallHPadding,
      ]}
    >
      <View style={{ marginTop: 15 }}>
        <Dropdown
          data={allBreeds}
          style={{ borderWidth: 1, borderRadius: 10, paddingHorizontal: 15 }}
          labelField="label"
          valueField="value"
          onChange={value => setFilter(value)}
          placeholder="Select Breed"
        />
        {filter && (
          <TouchableOpacity onPress={() => setFilter(false)} style={{ alignSelf: 'flex-end', marginTop: 5 }}>
            <Text style={{ color: 'green' }}>clear filter</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[{ marginVertical: 20, marginBottom: 60 }]}>
        {filter ? (
          <View style={{ marginTop: 25 }}>
            <Image
              source={{ uri: filter.image }}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
          </View>
        ) : (
          <FlatList
            numColumns={2}
            data={data}
            columnWrapperStyle={{
              justifyContent: 'space-around',
            }}
            renderItem={({ item }) => (
              <View style={{ marginTop: 25 }}>
                <Image
                  source={{ uri: item.url }}
                  style={{ width: 150, height: 150, borderRadius: 15 }}
                />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </ScrollView>
  )
}

export default ExampleContainer
