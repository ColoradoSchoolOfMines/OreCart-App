import React, { useMemo } from 'react'
import { StatusBar } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'

interface SheetProps {
  collapsedExtent: string,
  children: React.ReactNode;
}

/**
 * The sheet component containing the bottom sheet pattern.
 */
export function Sheet(props: SheetProps): React.ReactElement<void> {
  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])

  return (
    <BottomSheet
      index={0}
      topInset={statusBarInset}
      snapPoints={[props.collapsedExtent, '100%']}>
      {props.children}
    </BottomSheet>
  )
}
