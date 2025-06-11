import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { EllipsisVerticalIcon, PlusSmallIcon } from 'react-native-heroicons/outline';

export type HeaderMenuProps = {
    items: Array<{
        key:string;
        title: string;
        icon:string;
        iconAndroid?:string;
    }>;
    onSelect: (key: string) => void;
}

export default function HeaderMenu({items, onSelect}: HeaderMenuProps) {
  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <EllipsisVerticalIcon color={'black'} size={28} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.Item key='1'>
                    <DropdownMenu.ItemTitle>Add task</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: 'plus.circle',
                            pointSize: 20,
                        }}
                    />
                </DropdownMenu.Item>

                <DropdownMenu.Item key='3'>
                    <DropdownMenu.ItemTitle>Filter</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon
                        ios={{
                            name: 'line.3.horizontal.decrease.circle',
                            pointSize: 20,
                        }}
                    />
                </DropdownMenu.Item>
            </DropdownMenu.Group>       
        </DropdownMenu.Content>

    </DropdownMenu.Root>
  )
}

const styles = StyleSheet.create({})