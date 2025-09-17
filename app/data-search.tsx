
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExcelContext } from '../contexts/ExcelContext';
import { SearchResult } from '../types/ExcelData';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function DataSearchScreen() {
  const router = useRouter();
  const { selectedSheet, searchData } = useExcelContext();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!selectedSheet) {
      Alert.alert('Erreur', 'Aucune feuille sélectionnée', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  }, [selectedSheet]);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une valeur à rechercher');
      return;
    }

    console.log('Searching for:', searchValue);
    const result = searchData(searchValue.trim());
    setSearchResult(result);
    setShowResult(true);
  };

  const handleQRScan = () => {
    router.push('/qr-scanner');
  };

  const handleBack = () => {
    router.back();
  };

  const resetSearch = () => {
    setSearchValue('');
    setSearchResult(null);
    setShowResult(false);
  };

  if (!selectedSheet) {
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
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
          <View style={{ flex: 1 }}>
            <Text style={commonStyles.title}>Recherche de données</Text>
            <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey }]}>
              Feuille: {selectedSheet.name}
            </Text>
          </View>
        </View>

        {!showResult ? (
          <>
            <View style={[commonStyles.card, { marginBottom: 30, padding: 20 }]}>
              <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 15 }]}>
                Recherche manuelle
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, marginBottom: 15, color: colors.grey }]}>
                Rechercher dans la colonne {selectedSheet.columns[0]}
              </Text>
              
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent,
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  color: colors.text,
                  fontSize: 16,
                  marginBottom: 15,
                }}
                placeholder="Entrez la valeur à rechercher"
                placeholderTextColor={colors.grey}
                value={searchValue}
                onChangeText={setSearchValue}
                onSubmitEditing={handleSearch}
              />
              
              <Button
                text="Rechercher"
                onPress={handleSearch}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}
              />
            </View>

            <View style={[commonStyles.card, { padding: 20 }]}>
              <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 15 }]}>
                Scanner QR Code
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, marginBottom: 15, color: colors.grey }]}>
                Utilisez l&apos;appareil photo pour scanner un QR code
              </Text>
              
              <Button
                text="Ouvrir le scanner"
                onPress={handleQRScan}
                style={{
                  backgroundColor: colors.accent,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.background,
                }}
              />
            </View>
          </>
        ) : (
          <View style={[commonStyles.card, { padding: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                Résultat de la recherche
              </Text>
              <TouchableOpacity onPress={resetSearch}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {searchResult?.found ? (
              <View>
                <View style={{ 
                  backgroundColor: colors.primary, 
                  padding: 15, 
                  borderRadius: 8, 
                  marginBottom: 20 
                }}>
                  <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 8 }]}>
                    Valeur trouvée: {searchValue}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey }]}>
                    Ligne {searchResult.data?.rowIndex}
                  </Text>
                </View>

                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 15 }]}>
                  Données associées:
                </Text>

                {searchResult.data?.dataColumns.map((value, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.backgroundAlt,
                  }}>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                      Colonne {selectedSheet.columns[index + 1]}:
                    </Text>
                    <Text style={[commonStyles.text, { color: colors.accent }]}>
                      {value || 'Vide'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                <Icon name="search" size={60} color={colors.grey} />
                <Text style={[commonStyles.text, { marginTop: 15, textAlign: 'center' }]}>
                  Aucun résultat trouvé pour &quot;{searchValue}&quot;
                </Text>
                <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey, textAlign: 'center', marginTop: 8 }]}>
                  Vérifiez l&apos;orthographe ou essayez une autre valeur
                </Text>
              </View>
            )}

            <Button
              text="Nouvelle recherche"
              onPress={resetSearch}
              style={{
                backgroundColor: colors.backgroundAlt,
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 20,
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
