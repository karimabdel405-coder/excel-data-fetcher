
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useExcelContext } from '../contexts/ExcelContext';
import { SearchResult } from '../types/ExcelData';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function QRScannerScreen() {
  const router = useRouter();
  const { selectedSheet, searchData } = useExcelContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!selectedSheet) {
      Alert.alert('Erreur', 'Aucune feuille sélectionnée', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  }, [selectedSheet]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    console.log('QR Code scanned:', data);
    
    const result = searchData(data);
    setSearchResult(result);
    setShowResult(true);
  };

  const resetScanner = () => {
    setScanned(false);
    setSearchResult(null);
    setShowResult(false);
  };

  const handleBack = () => {
    router.back();
  };

  if (!permission) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.text}>Demande d&apos;autorisation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Icon name="camera-outline" size={80} color={colors.grey} />
          <Text style={[commonStyles.title, { marginTop: 20, marginBottom: 15 }]}>
            Autorisation requise
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 30 }]}>
            L&apos;application a besoin d&apos;accéder à l&apos;appareil photo pour scanner les QR codes
          </Text>
          <Button
            text="Autoriser l'accès à la caméra"
            onPress={requestPermission}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

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
      <View style={{ flex: 1 }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          padding: 20,
          backgroundColor: colors.background,
          zIndex: 1
        }}>
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
            <Text style={commonStyles.title}>Scanner QR Code</Text>
            <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey }]}>
              Feuille: {selectedSheet.name}
            </Text>
          </View>
        </View>

        {!showResult ? (
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'pdf417'],
              }}
            />
            
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>

            <View style={{
              position: 'absolute',
              bottom: 50,
              left: 20,
              right: 20,
              alignItems: 'center',
            }}>
              <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 20 }]}>
                Pointez l&apos;appareil photo vers un QR code
              </Text>
              {scanned && (
                <Button
                  text="Scanner à nouveau"
                  onPress={resetScanner}
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                  }}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                  }}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, padding: 20 }}>
            <View style={[commonStyles.card, { padding: 20, flex: 1 }]}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: 20 
              }}>
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                  Résultat du scan
                </Text>
                <TouchableOpacity onPress={resetScanner}>
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
                      QR Code détecté
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
                  <Icon name="qr-code-outline" size={60} color={colors.grey} />
                  <Text style={[commonStyles.text, { marginTop: 15, textAlign: 'center' }]}>
                    Aucun résultat trouvé pour ce QR code
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 14, color: colors.grey, textAlign: 'center', marginTop: 8 }]}>
                    Le code scanné ne correspond à aucune entrée dans la feuille sélectionnée
                  </Text>
                </View>
              )}

              <Button
                text="Scanner à nouveau"
                onPress={resetScanner}
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
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
});
