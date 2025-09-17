
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { MultiSearchResult, ExcelSheetData } from '../types/ExcelData';
import Icon from './Icon';

interface MultiSearchResultsProps {
  results: MultiSearchResult;
  selectedSheet: ExcelSheetData;
  onClose: () => void;
}

const MultiSearchResults: React.FC<MultiSearchResultsProps> = ({
  results,
  selectedSheet,
  onClose
}) => {
  if (!results.found) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Résultats de la recherche</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.noResultsContainer}>
          <Icon name="search" size={60} color={colors.grey} />
          <Text style={styles.noResultsText}>
            Aucun résultat trouvé
          </Text>
          <Text style={styles.noResultsSubtext}>
            Vérifiez l&apos;orthographe ou essayez d&apos;autres valeurs
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Résultats de la recherche</Text>
          <Text style={styles.resultCount}>
            {results.totalFound} résultat{results.totalFound > 1 ? 's' : ''} trouvé{results.totalFound > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {results.results.map((result, index) => (
          <View key={`${result.rowIndex}-${index}`} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                Valeur trouvée: {result.searchColumn}
              </Text>
              <Text style={styles.resultRowInfo}>
                Ligne {result.rowIndex}
              </Text>
            </View>

            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Données associées:</Text>
              {result.dataColumns.map((value, dataIndex) => (
                <View key={dataIndex} style={styles.dataRow}>
                  <Text style={styles.dataLabel}>
                    Colonne {selectedSheet.columns[dataIndex + 1]}:
                  </Text>
                  <Text style={styles.dataValue}>
                    {value || 'Vide'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  resultCount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 15,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  resultHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundAlt,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  resultRowInfo: {
    fontSize: 14,
    color: colors.grey,
  },
  dataContainer: {
    gap: 8,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

export default MultiSearchResults;
