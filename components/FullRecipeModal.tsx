// grab the param from View Full Recipe Button and fetch the full recipe data from the API.

// Display the full recipe details.

import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

type FullRecipeProps = {
  recipeId: number;
};

const FullRecipe = () => {
  return (
    <View>
      <Text>FullRecipe</Text>
    </View>
  )
}

export default FullRecipe