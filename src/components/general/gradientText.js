import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import THEME from '../../config/theme';


const GradientText = ({ text }) =>
    <LinearTextGradient
        style={{ fontWeight: '700', fontSize: 27, letterSpacing: 1, textDecorationLine: 'underline' }}
        locations={[0, 1]}
        colors={THEME.GRADIENT_BG.PAIR}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
        <Text>
            {text}
        </Text>
    </LinearTextGradient>

const GradientWord = ({ text }) =>
    <LinearTextGradient
        style={{ fontWeight: '700', fontSize: 27, letterSpacing: 1,}}
        locations={[0, 1]}
        colors={THEME.GRADIENT_BG.PAIR}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
        <Text>
            {text}
        </Text>
    </LinearTextGradient>

export { GradientText, GradientWord }