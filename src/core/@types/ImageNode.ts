import type { Node } from 'unist'

export interface ImageNode extends Node {
  title: string | null
  url: string
  alt: string
  children: string
  value: string
}
