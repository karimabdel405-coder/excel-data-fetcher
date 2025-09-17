
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { MultiSearchCriteria } from '../types/ExcelData';
import Icon from './Icon';

interface MultiSearchInputProps {
  searchCriteria: MultiSearchCriteria[];
  onSearchCriteriaChange: (criteria: MultiSearchCriteria[]) => void;
  onSearch: () => void;
  searchColumnName: string;
}

const MultiSearchInput: React.FC<MultiSearchInputProps> = ({
  searchCriteria,
  onSearchCriteriaChange,
  onSearch,
  searchColumnName
}) => {
  const addSearchCriteria = () => {
    const newCriteria: MultiSearchCriteria = {
      id: Date.now().toString(),
      value: '',
    };
    onSearchCriteriaChange([...searchCriteria, newCriteria]);
  };

  const removeSearchCriteria = (id: string) => {
    const updatedCriteria = searchCriteria.filter(criteria => criteria.id !== id);
    onSearchCriteriaChange(updatedCriteria);
  };

  const updateSearchCriteria = (id: string, value: string) => {
    const updatedCriteria = searchCriteria.map(criteria =>
      criteria.id === id ? { ...criteria, value } : criteria
    );
    onSearchCriteriaChange(updatedCriteria);
  };

  const hasValidCriteria = searchCriteria.some(criteria => criteria.value.trim() !== '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche multiple</Text>
        <Text style={styles.subtitle}>
          Rechercher dans la colonne {searchColumnName}
        </Text>
      </View>

      {searchCriteria.map((criteria, index) => (
        <View key={criteria.id} style={styles.criteriaRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Critère {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez une valeur à rechercher"
              placeholderTextColor={colors.grey}
              value={criteria.value}
              onChangeText={(value) => updateSearchCriteria(criteria.id, value)}
              onSubmitEditing={onSearch}
            />
          </View>
          
          {searchCriteria.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeSearchCriteria(criteria.id)}
            >
              <Icon name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addSearchCriteria}
        >
          <Icon name="add" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Ajouter un critère</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.searchButton,
            !hasValidCriteria && styles.searchButtonDisabled
          ]}
          onPress={onSearch}
          disabled={!hasValidCriteria}
        >
          <Icon name="search" size={20} color={hasValidCriteria ? colors.background : colors.grey} />
          <Text style={[
            styles.searchButtonText,
            !hasValidCriteria && styles.searchButtonTextDisabled
          ]}>
            Rechercher ({searchCriteria.filter(c => c.value.trim()).length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  searchButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  searchButtonTextDisabled: {
    color: colors.grey,
  },
});

export default MultiSearchInput;
