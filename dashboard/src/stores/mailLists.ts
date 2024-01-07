import { defineStore } from 'pinia'
import { api } from './auth'

export interface MailList {
  _id: string
}

export interface MailListsStore {
  mailLists: MailList[]
}

const getDefaultData = (): MailListsStore => ({
  mailLists: []
})

export const useMailListsStore = defineStore('mailLists', {
  state: getDefaultData,
  actions: {
    async getMailLists(): Promise<void> {
      try {
        const response = await api.get(`/mail-lists`)

        this.mailLists = response.data
      } catch (error) {
        console.error('Could not get maillists', error)
        throw error
      }
    }
  }
})
