package game

import (
	"github.com/floralbit/dungeon/game/model"
	"github.com/google/uuid"
)

type tile struct {
	ID    int    `json:"id"`
	Solid bool   `json:"solid"`
	Name  string `json:"name"`
}

type zone struct {
	UUID   uuid.UUID `json:"uuid"`
	Name   string    `json:"name"`
	Width  int       `json:"width"`
	Height int       `json:"height"`
	Tiles  []tile    `json:"tiles"`

	Entities     map[uuid.UUID]entity       `json:"entities"`
	WorldObjects map[uuid.UUID]*worldObject `json:"world_objects"`
}

func (z *zone) GetUUID() uuid.UUID {
	return z.UUID
}

func (z *zone) GetEntities() (entities []model.Entity) {
	for _, e := range z.Entities {
		entities = append(entities, e)
	}
	return
}

func (z *zone) getTile(x, y int) *tile {
	if x < 0 || y < 0 || x >= z.Width || y >= z.Height {
		return nil
	}

	index := (z.Width * y) + x
	return &z.Tiles[index]
}

func (z *zone) getWorldObjects(x, y int) []*worldObject {
	objs := []*worldObject{}

	for _, obj := range z.WorldObjects {
		if obj.X == x && obj.Y == y {
			objs = append(objs, obj)
		}
	}

	return objs
}

func (z *zone) addEntity(e entity) {
	z.Entities[e.Data().UUID] = e
	e.Data().zone = z
}

func (z *zone) removeEntity(e entity) {
	delete(z.Entities, e.Data().UUID)
}

func (z *zone) update(dt float64) {

	actions := []action{}
	for _, e := range z.Entities {
		e.Data().Energy++
		if e.Data().Energy >= e.Data().EnergyThreshold {
			e.Data().Energy = 0
			a := e.Act()
			if a != nil {
				actions = append(actions, a)
			}
		}
	}

	for _, a := range actions {
		a.Execute()
	}
}
