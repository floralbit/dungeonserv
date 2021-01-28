package game

import (
	"github.com/floralbit/dungeon/model"
	"github.com/google/uuid"
)

type entityType string

const (
	entityTypePlayer = "player"
)

type entity struct {
	UUID uuid.UUID  `json:"uuid"`
	Name string     `json:"name"`
	Tile int        `json:"tile"` // representing tile
	Type entityType `json:"type"`

	Stats stats `json:"stats"`

	X int `json:"x"`
	Y int `json:"y"`

	zone   *zone         `json:"-"`
	client *model.Client `json:"-"`
}

type stats struct {
	Level int `json:"level"`
	HP    int `json:"hp"`

	Strength     int `json:"strength"`
	Dexterity    int `json:"dexterity"`
	Constitution int `json:"constitution"`
	Intelligence int `json:"intelligence"`
	Wisdom       int `json:"wisdom"`
	Charisma     int `json:"charisma"`
}

func (e *entity) move(x, y int) {
	t := e.zone.getTile(x, y)
	if t == nil {
		return // edge of map, don't move
	}

	if t.Solid {
		return
	}

	e.X = x
	e.Y = y

	e.zone.send(newMoveEvent(e, x, y))
}

func (e *entity) leave() {
	e.zone.removeEntity(e)
	if e.Type == entityTypePlayer {
		delete(activePlayers, e.UUID)
	}
}

func modifier(stat int) int {
	return (stat - 10) / 2
}