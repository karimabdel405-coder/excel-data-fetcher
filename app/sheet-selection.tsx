
import React, { useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExcelContext } from '../contexts/ExcelContext';
import Icon from '../components/Icon';

export default function SheetSelectionScreen() {
  const router = useRouter();
  const { excelFile, selectSheet } = useExcelContext();

  useEffect(() => {
    if (!excelFile) {
      Alert.alert('Erreur', 'Aucun fichier Excel chargé', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  }, [excelFile]);

  const handleSheetSelect = (sheetName: string) => {
    selectSheet(sheetName);
    router.push('/data-search');
  };

  const handleBack = () => {
    router.back();
  };

  if (!excelFile) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.text}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity 
            onPress={handleBack}
            style={{ 
              padding: 8, 
              marginRight: 15,
              backgroundColor: colors.backgroundAlt,
              borderRadius: 8
            }}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Sélectionner une feuille</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {excelFile.sheets.map((sheet, index) => (
            <TouchableOpacity
              key={sheet.name}
              style={[
                commonStyles.card,
                {
                  marginBottom: 15,
                  padding: 20,
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.accent,
                  borderWidth: 1,
                }
              ]}
              onPress={() => handleSheetSelect(sheet.name)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 8 }]}>
                    {sheet.name}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey }]}>
                    {sheet.data.length} lignes de données
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 12, color: colors.grey, marginTop: 4 }]}>
                    Colonnes: {sheet.columns.join(', ')}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={24} color={colors.accent} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {excelFile.sheets.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Icon name="document-outline" size={80} color={colors.grey} />
            <Text style={[commonStyles.text, { marginTop: 20, textAlign: 'center' }]}>
              Aucune feuille de calcul trouvée dans ce fichier
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
