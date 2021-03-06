import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createDiary, deleteDiary, getDiaries, patchDiary } from '../api/diaries-api'
import Auth from '../auth/Auth'
import { Diary } from '../types/Diary'

interface DiariesProps {
  auth: Auth
  history: History
}

interface DiariesState {
  diaries: Diary[]
  newDiaryTitle: string
  newDiaryDescription: string
  loadingDiaries: boolean
}

export class Diaries extends React.PureComponent<DiariesProps, DiariesState> {
  state: DiariesState = {
    diaries: [],
    newDiaryTitle: '',
    newDiaryDescription: '',
    loadingDiaries: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryTitle: event.target.value })
  }
  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryDescription: event.target.value })
  }

  onEditButtonClick = (diaryId: string) => {
    this.props.history.push(`/diaries/${diaryId}/edit`)
  }

  onDiaryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newDiary = await createDiary(this.props.auth.getIdToken(), {
        title: this.state.newDiaryTitle,
        description: this.state.newDiaryDescription
      })
      this.setState({
        diaries: [...this.state.diaries, newDiary],
        newDiaryTitle: '',
        newDiaryDescription: '',
      })
    } catch {
      alert('Diary creation failed')
    }
  }

  onDiaryDelete = async (diaryId: string) => {
    try {
      await deleteDiary(this.props.auth.getIdToken(), diaryId)
      this.setState({
        diaries: this.state.diaries.filter(diary => diary.diaryId !== diaryId)
      })
    } catch {
      alert('Diary deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const diaries = await getDiaries(this.props.auth.getIdToken())
      this.setState({
        diaries,
        loadingDiaries: false
      })
    } catch (e: any) {
      alert(`Failed to fetch diaries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Diaries</Header>

        {this.renderCreateDiaryInput()}

        {this.renderDiaries()}
      </div>
    )
  }

  renderCreateDiaryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New diary',
              onClick: this.onDiaryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Nice Weather today..."
            onChange={this.handleTitleChange}
          />
          <br></br>
          <Input
            fluid
            actionPosition="left"
            placeholder="Add description here"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaries() {
    if (this.state.loadingDiaries) {
      return this.renderLoading()
    }

    return this.renderDiariesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diaries
        </Loader>
      </Grid.Row>
    )
  }

  renderDiariesList() {
    return (
      <Grid padded>
        {this.state.diaries.map((diary, pos) => {
          return (
            <Grid.Row key={diary.diaryId}>
              <Grid.Column width={10} verticalAlign="middle">
                {diary.title}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {diary.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(diary.diaryId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDiaryDelete(diary.diaryId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {diary.attachmentUrl && (
                <Image src={diary.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
