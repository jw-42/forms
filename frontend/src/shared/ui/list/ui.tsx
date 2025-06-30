import { Placeholder, Separator, Spacing } from "@vkontakte/vkui"
import { ListProps } from "./types"
import React from "react"

export const List = ({ children, after, afterCondition }: ListProps) => {
  return (
    <React.Fragment>
      {(children && children.length > 0) ? (
        <React.Fragment>
          {children.map((item, index) => (
            <React.Fragment key={index}>
              {item}

              {(index !== children.length - 1) && (
                <Spacing>
                  <Separator />
                </Spacing>
              )}
            </React.Fragment>
          ))}

          {(afterCondition && after) && (
            <React.Fragment>
              <Spacing>
                <Separator/>
              </Spacing>

              {after}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <Placeholder>
          Здесь пока ничего нет
        </Placeholder>
      )}
    </React.Fragment>
  )
}