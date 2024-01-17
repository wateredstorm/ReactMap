// @ts-check
import * as React from 'react'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useTheme, useMediaQuery } from '@mui/material/'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid2 from '@mui/material/Unstable_Grid2'

import Utility from '@services/Utility'
import { useDeepStore, useStorage } from '@hooks/useStorage'
import { useMemory } from '@hooks/useMemory'
import { useMap } from 'react-leaflet'

/**
 * @param {{
 *  name?: string
 *  feature?: Pick<import('@rm/types').RMFeature, 'properties'>
 *  allAreas?: string[]
 *  childAreas?: Pick<import('@rm/types').RMFeature, 'properties'>[]
 *  borderRight?: boolean
 *  colSpan?: number
 * }} props
 */

export function AreaChild({
  name,
  feature,
  childAreas,
  allAreas,
  borderRight,
  colSpan = 1,
}) {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('xs'))
  const scanAreas = useStorage((s) => s.filters?.scanAreas?.filter?.areas)
  const zoom = useMemory((s) => s.config.general.scanAreasZoom)
  const expandAllScanAreas = useMemory((s) => s.config.misc.expandAllScanAreas)
  const map = useMap()

  const { setAreas } = useStorage.getState()
  const [open, setOpen] = useDeepStore('scanAreasMenu', '')

  if (!scanAreas) return null

  const hasAll = 
    childAreas && 
    childAreas.every(
    (c) => c.properties.manual || scanAreas.includes(c.properties.key),
  )
  const hasSome = 
    childAreas && childAreas.some((c) => scanAreas.includes(c.properties.key))
  const hasManual = 
    feature?.properties?.manual || childAreas.every((c) => c.properties.manual)
  const color =
    hasManual || (name ? !childAreas.length : !feature.properties.name)
      ? 'transparent'
      : 'none'

  const nameProp = 
    name || feature?.properties?.formattedName || feature?.properties?.name
  const hasExpand = name && !expandAllScanAreas
  const isCheckboxDisabled = (name ? !childAreas.length : !feature.properties.name) || hasManual;
  const checkboxColor = color;

  const handleMapFlyTo = () => {
    if (feature?.properties?.center) {
      map.flyTo(
        feature.properties.center,
        feature.properties.zoom || zoom,
      )
    }
  };

  return (
    <TableCell
      colSpan={colSpan}
      sx={(theme) => ({
        bgcolor: theme.palette.background.paper,
        p: 0,
        borderRight: borderRight ? 1 : 'inherit',
        borderColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 200],
      })}
    >
      <Grid2 container spacing={isXSmall ? 1 : 2}
        onClick={handleMapFlyTo}
      >
        <Grid2 item xs={12} sm={6}>
          <Checkbox
            size="small"
            color="secondary"
            indeterminate={name ? hasSome && !hasAll : false}
            checked={name ? hasAll : scanAreas.includes(feature.properties.key)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => 
              setAreas(
                name ? childAreas.map((c) => c.properties.key) : [feature.properties.key],
                allAreas,
                name ? !hasAll : null,
              )
            }
            sx={{
              p: 1,
              color: checkboxColor,
              '&.Mui-checked': {
                color: checkboxColor,
              },
              '&.Mui-disabled': {
                color: checkboxColor,
              },
            }}
            disabled={isCheckboxDisabled}
          />
          <Typography
            variant={name ? 'h6' : 'caption'}
            align="center"
            style={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}
          >
            {nameProp || <>&nbsp;</>}
          </Typography>
          {hasExpand && (
            <IconButton
              component="span"
              className={open === name ? 'expanded' : 'collapsed'}
              onClick={(e) => {
                e.stopPropagation()
                setOpen((prev) => (prev === name ? '' : name))
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Grid2>

        {isXSmall && (
          <Grid2
            container
            alignItems="center"
            justifyContent="space-between"
            component={Button}
            fullWidth
            borderRadius={0}
            variant="text"
            color="inherit"
            size="small"
            wrap="nowrap"
            onClick={() => handleMapFlyTo()}
            sx={(theme) => ({
              py: name ? 'inherit' : 0,
              minHeight: 36,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            {!hasExpand && hasManual ? null : (
              <Checkbox
                size="small"
                color="secondary"
                indeterminate={name ? hasSome && !hasAll : false}
                checked={name ? hasAll : scanAreas.includes(feature.properties.key)}
                onClick={(e) => e.stopPropagation()}
                onChange={() =>
                  setAreas(
                    name ? childAreas.map((c) => c.properties.key) : feature.properties.key,
                    allAreas,
                    name ? hasSome : false,
                  )
                }
                sx={{
                  p: 1,
                  color: checkboxColor,
                  '&.Mui-checked': {
                    color: checkboxColor,
                  },
                  '&.Mui-disabled': {
                    color: checkboxColor,
                  },
                }}
                disabled={isCheckboxDisabled}
              />
            )}
            <Typography
              variant={name ? 'h6' : 'caption'}
              align="center"
              style={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}
            >
              {nameProp || <>&nbsp;</>}
            </Typography>
            {hasExpand && (
              <IconButton
                component="span"
                className={open === name ? 'expanded' : 'collapsed'}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen((prev) => (prev === name ? '' : name))
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Grid2>
        )}
      </Grid2>
    </TableCell>
  );
}
