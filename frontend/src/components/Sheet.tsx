import React, { useMemo } from 'react'
import { StatusBar } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'

interface SheetProps {
  children: React.ReactNode;
}

/**
 * The sheet component containing the bottom sheet pattern.
 */
export function Sheet({ children }: SheetProps): React.ReactElement<void> {
  const topInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const snapPoints = ['50%', '100%']

  return (
    <BottomSheet
      index={0}
      topInset={topInset}
      snapPoints={snapPoints}>
      {children}
    </BottomSheet>
  )
}
