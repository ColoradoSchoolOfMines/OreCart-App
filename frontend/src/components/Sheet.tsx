import React, { useMemo } from 'react'
import { StatusBar } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'

/**
 * The props for the {@interface Sheet} component.
 */
interface SheetProps {
  /** How much of the bottom sheet to show initially, such as '50%' */
  collapsedExtent: string,
  /** The child view of the bottom sheet */
  children: React.ReactNode;
}

/**
 * Wraps the bottom sheet component with a simplified interface.
 */
export function Sheet(props: SheetProps): React.ReactElement<void> {
  // Don't want the sheet bleeding into the status bar at full extent.
  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  // Only collapsed extent and full extent.
  const snapPoints = [props.collapsedExtent, '100%'];

  return (
    <BottomSheet
      index={0}
      topInset={statusBarInset}
      snapPoints={snapPoints}>
      {props.children}
    </BottomSheet>
  )
}
