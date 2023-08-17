import * as React from 'react'
import Refresh from '@mui/icons-material/Refresh'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { useTranslation } from 'react-i18next'

import Header from '../general/Header'

export default function ClientError({ error }) {
  const { t } = useTranslation()
  return (
    <Dialog open={Boolean(error)}>
      <Header titles={[`${error}_title`]} />
      <DialogContent style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
        <br />
        <Typography variant="h6">{t(`${error}_body`)}</Typography>
        <br />
        <Typography variant="h6">{t('refresh_to_continue')}</Typography>
        <br />
        <Button
          onClick={() => (window.location = window.location.href)}
          variant="contained"
          color="primary"
          style={{ marginBottom: 20 }}
          startIcon={<Refresh />}
        >
          {t('refresh')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
