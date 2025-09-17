
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExcelContext } from '../contexts/ExcelContext';
import { SearchResult, MultiSearchCriteria, MultiSearchResult } from '../types/ExcelData';
import Button from '../components/Button';
import Icon from '../components/Icon';
import MultiSearchInput from '../components/MultiSearchInput';
import MultiSearchResults from '../components/MultiSearchResults';

type SearchMode = 'single' | 'multiple';

export default function DataSearchScreen() {
  const router = useRouter();
  const { selectedSheet, searchData, multiSearchData } = useExcelContext();
  const [searchMode, setSearchMode] = useState<SearchMode>('single');
  
  // Single search state
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showSingleResult, setShowSingleResult] = useState(false);
  
  // Multiple search state
  const [searchCriteria, setSearchCriteria] = useState<MultiSearchCriteria[]>([
    { id: '1', value: '' }
  ]);
  const [multiSearchResult, setMultiSearchResult] = useState<MultiSearchResult | null>(null);
  const [showMultiResult, setShowMultiResult] = useState(false);

  useEffect(() => {
    if (!selectedSheet) {
      Alert.alert('Erreur', 'Aucune feuille sélectionnée', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  }, [selectedSheet]);

  const handleSingleSearch = () => {
    if (!searchValue.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une valeur à rechercher');
      return;
    }

    console.log('Single search for:', searchValue);
    const result = searchData(searchValue.trim());
    setSearchResult(result);
    setShowSingleResult(true);
  };

  const handleMultiSearch = () => {
    const validCriteria = searchCriteria.filter(criteria => criteria.value.trim() !== '');
    
    if (validCriteria.length === 0) {
      Alert.alert('Erreur', 'Veuillez entrer au moins une valeur à rechercher');
      return;
    }

    console.log('Multi search for:', validCriteria);
    const result = multiSearchData(validCriteria);
    setMultiSearchResult(result);
    setShowMultiResult(true);
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
    setShowSingleResult(false);
    setSearchCriteria([{ id: '1', value: '' }]);
    setMultiSearchResult(null);
    setShowMultiResult(false);
  };

  const switchSearchMode = (mode: SearchMode) => {
    setSearchMode(mode);
    resetSearch();
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

  const showingResults = showSingleResult || showMultiResult;

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

        {!showingResults ? (
          <>
            {/* Mode Selection */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: colors.backgroundAlt,
              borderRadius: 8,
              padding: 4,
              marginBottom: 20,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  backgroundColor: searchMode === 'single' ? colors.primary : 'transparent',
                }}
                onPress={() => switchSearchMode('single')}
              >
                <Text style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: searchMode === 'single' ? colors.background : colors.text,
                }}>
                  Recherche simple
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  backgroundColor: searchMode === 'multiple' ? colors.primary : 'transparent',
                }}
                onPress={() => switchSearchMode('multiple')}
              >
                <Text style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: searchMode === 'multiple' ? colors.background : colors.text,
                }}>
                  Recherche multiple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            {searchMode === 'single' ? (
              <View style={[commonStyles.card, { marginBottom: 30, padding: 20 }]}>
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 15 }]}>
                  Recherche simple
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
                  onSubmitEditing={handleSingleSearch}
                />
                
                <Button
                  text="Rechercher"
                  onPress={handleSingleSearch}
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
            ) : (
              <MultiSearchInput
                searchCriteria={searchCriteria}
                onSearchCriteriaChange={setSearchCriteria}
                onSearch={handleMultiSearch}
                searchColumnName={selectedSheet.columns[0]}
              />
            )}

            {/* QR Scanner */}
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
          <>
            {/* Single Search Results */}
            {showSingleResult && searchResult && (
              <View style={[commonStyles.card, { padding: 20 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                    Résultat de la recherche
                  </Text>
                  <TouchableOpacity onPress={resetSearch}>
                    <Icon name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {searchResult.found ? (
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

            {/* Multiple Search Results */}
            {showMultiResult && multiSearchResult && (
              <MultiSearchResults
                results={multiSearchResult}
                selectedSheet={selectedSheet}
                onClose={resetSearch}
              />
            )}

            {/* New Search Button */}
            <View style={{ marginTop: 20 }}>
              <Button
                text="Nouvelle recherche"
                onPress={resetSearch}
                style={{
                  backgroundColor: colors.primary,
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
