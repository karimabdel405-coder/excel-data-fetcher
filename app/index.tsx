
import React from 'react';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useExcelContext } from '../contexts/ExcelContext';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function MainScreen() {
  const router = useRouter();
  const { loadExcelFile, isLoading, error, excelFile } = useExcelContext();

  const handlePickExcelFile = async () => {
    try {
      console.log('Opening document picker...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/excel'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file:', file.name);
        
        await loadExcelFile(file.uri);
        
        if (!error) {
          router.push('/sheet-selection');
        }
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier Excel');
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 60 }}>
          <Icon 
            name="document-text-outline" 
            size={120} 
            color={colors.accent}
            style={{ marginBottom: 20 }}
          />
          <Text style={commonStyles.title}>Analyseur Excel</Text>
          <Text style={[commonStyles.text, { textAlign: 'center', marginHorizontal: 20 }]}>
            Sélectionnez un fichier Excel pour commencer l&apos;analyse des données
          </Text>
        </View>

        {error && (
          <View style={[commonStyles.card, { backgroundColor: '#ff4444', marginBottom: 20 }]}>
            <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
              {error}
            </Text>
          </View>
        )}

        <View style={commonStyles.buttonContainer}>
          {isLoading ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[commonStyles.text, { marginTop: 10 }]}>
                Traitement du fichier Excel...
              </Text>
            </View>
          ) : (
            <Button
              text="Sélectionner un fichier Excel"
              onPress={handlePickExcelFile}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 12,
                width: '100%',
                maxWidth: 300,
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
              }}
            />
          )}
        </View>

        {excelFile && (
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Text style={[commonStyles.text, { color: colors.accent }]}>
              Fichier chargé: {excelFile.sheets.length} feuille(s) trouvée(s)
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
